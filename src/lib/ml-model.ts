import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
tf.setBackend('cpu');

interface LocationRiskFactors {
  [key: string]: {
    baseRisks: {
      respiratory: number;
      cardiovascular: number;
      diabetes: number;
      infectious: number;
    };
    environmentalImpact: {
      airQuality: number;
      waterQuality: number;
      pollutionLevel: number;
    };
  };
}

const locationRiskFactors: LocationRiskFactors = {
  'Mumbai': {
    baseRisks: {
      respiratory: 0.4,
      cardiovascular: 0.35,
      diabetes: 0.3,
      infectious: 0.25
    },
    environmentalImpact: {
      airQuality: 0.8,
      waterQuality: 0.6,
      pollutionLevel: 0.75
    }
  },
  'Chennai': {
    baseRisks: {
      respiratory: 0.35,
      cardiovascular: 0.3,
      diabetes: 0.35,
      infectious: 0.3
    },
    environmentalImpact: {
      airQuality: 0.7,
      waterQuality: 0.75,
      pollutionLevel: 0.65
    }
  },
  'Kolkata': {
    baseRisks: {
      respiratory: 0.45,
      cardiovascular: 0.4,
      diabetes: 0.35,
      infectious: 0.35
    },
    environmentalImpact: {
      airQuality: 0.85,
      waterQuality: 0.6,
      pollutionLevel: 0.8
    }
  },
  'default': {
    baseRisks: {
      respiratory: 0.3,
      cardiovascular: 0.3,
      diabetes: 0.3,
      infectious: 0.3
    },
    environmentalImpact: {
      airQuality: 0.5,
      waterQuality: 0.5,
      pollutionLevel: 0.5
    }
  }
};

export class HealthRiskPredictor {
  private model: tf.Sequential;
  private initialized: boolean = false;

  constructor() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [12],
          units: 24,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l1l2({ l1: 0.01, l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l1l2({ l1: 0.01, l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 8,
          activation: 'relu'
        }),
        tf.layers.dense({
          units: 4,
          activation: 'sigmoid'
        })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  private async initialize() {
    if (this.initialized) return;
    
    // Initialize with some synthetic data
    const numSamples = 1000;
    const inputDim = 12;
    
    const syntheticData = tf.randomNormal([numSamples, inputDim]);
    const syntheticLabels = tf.randomUniform([numSamples, 4]);
    
    await this.model.fit(syntheticData, syntheticLabels, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    this.initialized = true;
    
    // Clean up tensors
    syntheticData.dispose();
    syntheticLabels.dispose();
  }

  private calculateLifestyleScore(lifestyle: any): number {
    let score = 0;
    
    // Smoking impact
    score += lifestyle?.smoking_status === 'Current smoker' ? 0.3 :
             lifestyle?.smoking_status === 'Former smoker' ? 0.15 : 0;
    
    // Alcohol impact
    score += lifestyle?.alcohol_consumption === 'Regular' ? 0.2 :
             lifestyle?.alcohol_consumption === 'Occasional' ? 0.1 : 0;
    
    // Exercise impact (more exercise = lower risk)
    const exerciseDays = parseInt(lifestyle?.exercise_frequency || '0');
    if (!isNaN(exerciseDays)) {
      score += -0.15 * (exerciseDays / 7);
    }
    
    return score;
  }

  private calculateEnvironmentalImpact(location: string, condition: string): number {
    const locationData = locationRiskFactors[location] || locationRiskFactors['default'];
    
    let impact = 0;
    
    switch ((condition || '').toLowerCase()) {
      case 'respiratory issues':
      case 'asthma':
        impact = locationData.environmentalImpact.airQuality * 0.6 +
                locationData.environmentalImpact.pollutionLevel * 0.4;
        break;
      case 'cardiovascular disease':
        impact = locationData.environmentalImpact.airQuality * 0.4 +
                locationData.environmentalImpact.pollutionLevel * 0.4 +
                locationData.environmentalImpact.waterQuality * 0.2;
        break;
      case 'diabetes':
        impact = locationData.environmentalImpact.waterQuality * 0.5 +
                locationData.environmentalImpact.pollutionLevel * 0.3 +
                locationData.environmentalImpact.airQuality * 0.2;
        break;
      default:
        impact = (locationData.environmentalImpact.airQuality +
                 locationData.environmentalImpact.waterQuality +
                 locationData.environmentalImpact.pollutionLevel) / 3;
    }

    return impact;
  }

  async predict(patient: any) {
    await this.initialize();

    const location = patient?.location || 'default';
    const lifestyleScore = this.calculateLifestyleScore(patient?.lifestyle_factors);
    const environmentalImpact = this.calculateEnvironmentalImpact(location, patient?.condition);
    
    const locationData = locationRiskFactors[location] || locationRiskFactors['default'];
    
    const features = [
      (patient?.age || 30) / 100,
      (patient?.vital_signs?.blood_pressure?.systolic || 120) / 200,
      (patient?.vital_signs?.blood_sugar?.fasting || 100) / 200,
      (patient?.vital_signs?.oxygen_saturation || 98) / 100,
      lifestyleScore,
      environmentalImpact,
      locationData.baseRisks.respiratory,
      locationData.baseRisks.cardiovascular,
      locationData.baseRisks.diabetes,
      locationData.baseRisks.infectious,
      (patient?.medical_history?.chronic_conditions?.length || 0) / 5,
      (patient?.medical_history?.family_history?.length || 0) / 5
    ];

    const inputTensor = tf.tensor2d([features]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const probabilities = await prediction.array();
    
    inputTensor.dispose();
    prediction.dispose();

    const diseases = [
      { name: 'Respiratory Disease', probability: probabilities[0][0] },
      { name: 'Cardiovascular Disease', probability: probabilities[0][1] },
      { name: 'Diabetes', probability: probabilities[0][2] },
      { name: 'Infectious Disease', probability: probabilities[0][3] }
    ];

    const environmentalFactors = [
      { impact: 'Air Quality Impact', score: locationData.environmentalImpact.airQuality },
      { impact: 'Water Quality Impact', score: locationData.environmentalImpact.waterQuality },
      { impact: 'Pollution Impact', score: locationData.environmentalImpact.pollutionLevel }
    ];

    const recommendedSpecialists = diseases
      .filter(d => d.probability > 0.3)
      .map(d => {
        switch (d.name) {
          case 'Respiratory Disease': return 'Pulmonologist';
          case 'Cardiovascular Disease': return 'Cardiologist';
          case 'Diabetes': return 'Endocrinologist';
          case 'Infectious Disease': return 'Infectious Disease Specialist';
          default: return null;
        }
      })
      .filter(Boolean) as string[];

    const vitalSignsAnalysis = {
      blood_pressure_status: this.getBloodPressureStatus(patient?.vital_signs?.blood_pressure),
      blood_sugar_status: this.getBloodSugarStatus(patient?.vital_signs?.blood_sugar),
      oxygen_status: this.getOxygenStatus(patient?.vital_signs?.oxygen_saturation),
      overall_health_score: this.calculateOverallHealthScore(patient?.vital_signs)
    };

    return {
      diseases,
      environmentalFactors,
      recommended_specialists: recommendedSpecialists,
      vital_signs_analysis: vitalSignsAnalysis,
      risk_level: this.getRiskLevel(diseases)
    };
  }

  private getBloodPressureStatus(bp: any) {
    const systolic = bp?.systolic || 120;
    const diastolic = bp?.diastolic || 80;
    
    if (systolic >= 140 || diastolic >= 90) return 'High';
    if (systolic <= 90 || diastolic <= 60) return 'Low';
    return 'Normal';
  }

  private getBloodSugarStatus(bs: any) {
    const fasting = bs?.fasting || 100;
    const postPrandial = bs?.post_prandial || 140;
    
    if (fasting >= 126 || postPrandial >= 200) return 'High';
    if (fasting <= 70 || postPrandial <= 140) return 'Low';
    return 'Normal';
  }

  private getOxygenStatus(oxygen: number) {
    return (oxygen || 98) < 95 ? 'Low' : 'Normal';
  }

  private calculateOverallHealthScore(vitalSigns: any) {
    let score = 100;
    
    // Blood pressure impact
    const systolic = vitalSigns?.blood_pressure?.systolic || 120;
    const diastolic = vitalSigns?.blood_pressure?.diastolic || 80;
    if (systolic > 140 || diastolic > 90) score -= 15;
    else if (systolic < 90 || diastolic < 60) score -= 10;
    
    // Blood sugar impact
    const fasting = vitalSigns?.blood_sugar?.fasting || 100;
    const postPrandial = vitalSigns?.blood_sugar?.post_prandial || 140;
    if (fasting > 126 || postPrandial > 200) score -= 15;
    else if (fasting < 70 || postPrandial < 140) score -= 10;
    
    // Oxygen impact
    const oxygen = vitalSigns?.oxygen_saturation || 98;
    if (oxygen < 95) score -= 20;
    else if (oxygen < 98) score -= 10;
    
    return Math.max(0, score);
  }

  getRiskLevel(diseases: Array<{ name: string; probability: number }>) {
    const maxProbability = Math.max(...diseases.map(d => d.probability));
    if (maxProbability > 0.7) return 'High';
    if (maxProbability > 0.4) return 'Medium';
    return 'Low';
  }
}

export const healthPredictor = new HealthRiskPredictor();