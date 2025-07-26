import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, TrendingUp, Users, FileText, AlertTriangle, LogOut } from 'lucide-react';

// Import components
import LoanApplicationForm from '@/components/loan/LoanApplicationForm';
import ApplicantDashboard from '@/components/dashboards/ApplicantDashboard';
import AuditorDashboard from '@/components/dashboards/AuditorDashboard';
import BusinessDashboard from '@/components/dashboards/BusinessDashboard';
import ModelExplainability from '@/components/ai/ModelExplainability';
import BiasMonitoring from '@/components/ai/BiasMonitoring';
import DataPipeline from '@/components/ai/DataPipeline';
import MLOpsMonitoring from '@/components/ai/MLOpsMonitoring';

interface IndexProps {
  session: Session;
}

const Index: React.FC<IndexProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Decisions',
      description: 'Real-time loan approvals with explainable AI models',
      color: 'gradient-primary'
    },
    {
      icon: Shield,
      title: 'Bias Detection',
      description: 'Continuous monitoring and mitigation of algorithmic bias',
      color: 'gradient-success'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Comprehensive metrics and business intelligence',
      color: 'gradient-warning'
    },
    {
      icon: Users,
      title: 'Multi-Stakeholder Views',
      description: 'Tailored dashboards for applicants, auditors, and business',
      color: 'gradient-tech'
    }
  ];

  const stats = [
    { label: 'Loan Applications Processed', value: '156,847', change: '+12.5%' },
    { label: 'Average Decision Time', value: '2.3s', change: '-45.2%' },
    { label: 'Model Accuracy', value: '94.2%', change: '+2.1%' },
    { label: 'Bias Score', value: '0.02', change: '-85.3%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  LendoraX:<br />
                  Smart Loan Analytics & Fairness Suite
                </h1>
                <p className="text-sm text-muted-foreground">Welcome, {session.user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-success border-success">
                <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></span>
                System Active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
            <TabsTrigger value="applicant">Applicant</TabsTrigger>
            <TabsTrigger value="auditor">Auditor</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="explainability">AI Explain</TabsTrigger>
            <TabsTrigger value="bias">Bias Monitor</TabsTrigger>
            <TabsTrigger value="mlops">MLOps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden shadow-strong">
              <CardContent className="p-0">
                <div className="gradient-primary text-white p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-3xl font-bold mb-4">
                        End-to-End Explainable AI for Loan Approvals
                      </h2>
                      <p className="text-white/90 mb-6">
                        Comprehensive AI system that automates loan decisions with full explainability, 
                        bias monitoring, and regulatory compliance. Built for speed, fairness, and transparency.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant="secondary"
                          onClick={() => setActiveTab('apply')}
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        >
                          Try Demo Application
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setActiveTab('explainability')}
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          View AI Explanations
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Real-time Processing</span>
                            <span className="text-white font-semibold">Active</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-3/4 animate-pulse"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-white">2.3s</div>
                              <div className="text-white/70 text-sm">Avg Decision Time</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">94.2%</div>
                              <div className="text-white/70 text-sm">Accuracy</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-soft transition-smooth hover:shadow-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <div className="flex items-baseline space-x-2">
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <span className={`text-sm font-medium ${
                            stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        stat.change.startsWith('+') ? 'bg-success' : 'bg-primary'
                      } animate-pulse`}></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-soft transition-smooth hover:shadow-medium overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Architecture */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>System Architecture</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive end-to-end pipeline covering all aspects of responsible AI deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Data & Privacy</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Real-time data ingestion via Kaggle API</li>
                      <li>• Privacy-preserving preprocessing</li>
                      <li>• Automated data validation</li>
                      <li>• Bias detection in raw data</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">AI & Explainability</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ensemble modeling (LR + XGBoost)</li>
                      <li>• SHAP & LIME explanations</li>
                      <li>• Real-time inference API</li>
                      <li>• Fairness-aware training</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">MLOps & Monitoring</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Continuous model monitoring</li>
                      <li>• Automated bias detection</li>
                      <li>• A/B testing framework</li>
                      <li>• Regulatory compliance reports</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply">
            <LoanApplicationForm session={session} />
          </TabsContent>

          <TabsContent value="applicant">
            <ApplicantDashboard session={session} />
          </TabsContent>

          <TabsContent value="auditor">
            <AuditorDashboard />
          </TabsContent>

          <TabsContent value="business">
            <BusinessDashboard />
          </TabsContent>

          <TabsContent value="explainability">
            <ModelExplainability />
          </TabsContent>

          <TabsContent value="bias">
            <BiasMonitoring />
          </TabsContent>

          <TabsContent value="mlops">
            <div className="grid gap-6">
              <DataPipeline />
              <MLOpsMonitoring />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;