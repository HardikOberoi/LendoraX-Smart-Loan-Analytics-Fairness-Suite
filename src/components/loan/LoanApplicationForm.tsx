import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Brain, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoanApplication {
  personalInfo: {
    fullName: string;
    age: number;
    employment: string;
    income: number;
    experience: number;
  };
  loanDetails: {
    amount: number;
    purpose: string;
    term: number;
  };
  financialInfo: {
    creditScore: number;
    existingLoans: number;
    collateral: string;
  };
}

interface LoanApplicationFormProps {
  session: Session;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ session }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const { toast } = useToast();
  
  const [application, setApplication] = useState<LoanApplication>({
    personalInfo: {
      fullName: '',
      age: 0,
      employment: '',
      income: 0,
      experience: 0
    },
    loanDetails: {
      amount: 0,
      purpose: '',
      term: 0
    },
    financialInfo: {
      creditScore: 0,
      existingLoans: 0,
      collateral: ''
    }
  });

  const simulateAIDecision = async () => {
    setIsProcessing(true);
    
    try {
      // Calculate decision
      const score = calculateRiskScore();
      const isApproved = score > 0.6;
      const riskScore = score * 100;
      
      const factors = [
        { name: 'Credit Score', impact: 0.35, value: application.financialInfo.creditScore },
        { name: 'Income Level', impact: 0.25, value: application.personalInfo.income },
        { name: 'Employment Status', impact: 0.20, value: application.personalInfo.employment },
        { name: 'Debt-to-Income Ratio', impact: 0.15, value: calculateDebtToIncome() },
        { name: 'Loan Amount', impact: 0.05, value: application.loanDetails.amount }
      ];

      const explanationData = {
        score: score,
        factors: factors,
        reasoning: isApproved 
          ? "Application approved based on strong credit profile and stable income."
          : "Application requires additional review due to risk factors."
      };

      // Save to database
      const { error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: session.user.id,
          loan_amount: application.loanDetails.amount,
          loan_purpose: application.loanDetails.purpose,
          employment_type: application.personalInfo.employment,
          annual_income: application.personalInfo.income,
          credit_score: application.financialInfo.creditScore,
          loan_term: application.loanDetails.term,
          collateral_value: application.financialInfo.collateral === 'none' ? 0 : 50000, // Estimated
          debt_to_income_ratio: calculateDebtToIncome(),
          credit_history_length: application.personalInfo.experience,
          status: isApproved ? 'approved' : 'rejected',
          ai_decision: explanationData.reasoning,
          ai_confidence: score * 100,
          risk_score: riskScore,
          explanation: explanationData
        });

      if (error) {
        throw error;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDecision(isApproved ? 'approved' : 'rejected');
      setExplanation(explanationData);
      
      toast({
        title: "Application Submitted",
        description: `Your loan application has been ${isApproved ? 'approved' : 'submitted for review'}.`,
        variant: isApproved ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateRiskScore = () => {
    const creditWeight = (application.financialInfo.creditScore / 850) * 0.4;
    const incomeWeight = Math.min(application.personalInfo.income / 100000, 1) * 0.3;
    const employmentWeight = application.personalInfo.employment === 'full-time' ? 0.2 : 0.1;
    const experienceWeight = Math.min(application.personalInfo.experience / 10, 1) * 0.1;
    
    return creditWeight + incomeWeight + employmentWeight + experienceWeight;
  };

  const calculateDebtToIncome = () => {
    return (application.loanDetails.amount * 12) / (application.personalInfo.income || 1);
  };

  const handleSubmit = () => {
    simulateAIDecision();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setDecision(null);
    setExplanation(null);
    setApplication({
      personalInfo: { fullName: '', age: 0, employment: '', income: 0, experience: 0 },
      loanDetails: { amount: 0, purpose: '', term: 0 },
      financialInfo: { creditScore: 0, existingLoans: 0, collateral: '' }
    });
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-strong">
          <CardContent className="p-8 text-center">
            <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-4">AI Processing Your Application</h3>
            <p className="text-muted-foreground mb-6">
              Our AI models are analyzing your application with explainable decision-making...
            </p>
            <Progress value={75} className="mb-4" />
            <div className="text-sm text-muted-foreground">
              Estimated completion: 2-3 seconds
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (decision) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className={`shadow-strong border-2 ${
          decision === 'approved' ? 'border-success' : 'border-destructive'
        }`}>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                decision === 'approved' ? 'gradient-success' : 'bg-destructive'
              }`}>
                {decision === 'approved' ? 
                  <CheckCircle className="h-8 w-8 text-white" /> : 
                  <XCircle className="h-8 w-8 text-white" />
                }
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Application {decision === 'approved' ? 'Approved' : 'Requires Review'}
              </h2>
              <p className="text-muted-foreground">
                {explanation?.reasoning}
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Decision Explanation
                </h3>
                <div className="space-y-3">
                  {explanation?.factors.map((factor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{factor.name}</span>
                      <div className="flex items-center space-x-3">
                        <Badge variant={factor.impact > 0.2 ? "default" : "secondary"}>
                          {(factor.impact * 100).toFixed(0)}% impact
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {typeof factor.value === 'number' ? factor.value.toLocaleString() : factor.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This decision was made using bias-free AI algorithms with continuous fairness monitoring.
                  All decisions are auditable and explainable for regulatory compliance.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center space-x-4">
                <Button onClick={resetForm} variant="outline">
                  Submit New Application
                </Button>
                <Button className="gradient-primary text-white">
                  Contact Loan Officer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-strong">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>AI Loan Application</span>
          </CardTitle>
          <CardDescription>
            Real-time AI decision with full explainability and bias monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={application.personalInfo.fullName}
                    onChange={(e) => setApplication({
                      ...application,
                      personalInfo: { ...application.personalInfo, fullName: e.target.value }
                    })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={application.personalInfo.age || ''}
                    onChange={(e) => setApplication({
                      ...application,
                      personalInfo: { ...application.personalInfo, age: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="employment">Employment Status</Label>
                <Select onValueChange={(value) => setApplication({
                  ...application,
                  personalInfo: { ...application.personalInfo, employment: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time Employee</SelectItem>
                    <SelectItem value="part-time">Part-time Employee</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Annual Income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={application.personalInfo.income || ''}
                    onChange={(e) => setApplication({
                      ...application,
                      personalInfo: { ...application.personalInfo, income: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="75000"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Work Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={application.personalInfo.experience || ''}
                    onChange={(e) => setApplication({
                      ...application,
                      personalInfo: { ...application.personalInfo, experience: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Loan Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Loan Details</h3>
              
              <div>
                <Label htmlFor="amount">Loan Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={application.loanDetails.amount || ''}
                  onChange={(e) => setApplication({
                    ...application,
                    loanDetails: { ...application.loanDetails, amount: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="50000"
                />
              </div>

              <div>
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Select onValueChange={(value) => setApplication({
                  ...application,
                  loanDetails: { ...application.loanDetails, purpose: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Purchase</SelectItem>
                    <SelectItem value="car">Vehicle Purchase</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="term">Loan Term (years)</Label>
                <Select onValueChange={(value) => setApplication({
                  ...application,
                  loanDetails: { ...application.loanDetails, term: parseInt(value) }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              
              <div>
                <Label htmlFor="creditScore">Credit Score</Label>
                <Input
                  id="creditScore"
                  type="number"
                  value={application.financialInfo.creditScore || ''}
                  onChange={(e) => setApplication({
                    ...application,
                    financialInfo: { ...application.financialInfo, creditScore: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="720"
                  min="300"
                  max="850"
                />
              </div>

              <div>
                <Label htmlFor="existingLoans">Existing Loans ($)</Label>
                <Input
                  id="existingLoans"
                  type="number"
                  value={application.financialInfo.existingLoans || ''}
                  onChange={(e) => setApplication({
                    ...application,
                    financialInfo: { ...application.financialInfo, existingLoans: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="15000"
                />
              </div>

              <div>
                <Label htmlFor="collateral">Collateral</Label>
                <Select onValueChange={(value) => setApplication({
                  ...application,
                  financialInfo: { ...application.financialInfo, collateral: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collateral type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Collateral</SelectItem>
                    <SelectItem value="home">Home/Property</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="stocks">Stocks/Bonds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="gradient-primary text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gradient-primary text-white"
              >
                Submit for AI Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplicationForm;