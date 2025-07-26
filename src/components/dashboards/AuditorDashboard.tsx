import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataSourceBanner, EmptyDataState } from '@/components/ui/data-source-banner';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileSearch, 
  BarChart3,
  Eye,
  Download,
  Calendar
} from 'lucide-react';

const AuditorDashboard = () => {
  const [isUsingDemoData, setIsUsingDemoData] = useState(true);
  const [hasUserData] = useState(false);
  const fairnessMetrics = [
    { metric: 'Demographic Parity', value: 0.02, threshold: 0.05, status: 'pass' },
    { metric: 'Equal Opportunity', value: 0.01, threshold: 0.03, status: 'pass' },
    { metric: 'Equalized Odds', value: 0.04, threshold: 0.05, status: 'warning' },
    { metric: 'Disparate Impact', value: 0.95, threshold: 0.80, status: 'pass' }
  ];

  const biasAlerts = [
    {
      id: 1,
      severity: 'medium',
      metric: 'Age Bias Detection',
      description: 'Slight bias detected in approval rates for applicants aged 60+',
      timestamp: '2024-01-20 14:30',
      status: 'investigating'
    },
    {
      id: 2,
      severity: 'low',
      metric: 'Geographic Bias',
      description: 'Minor variance in approval rates across ZIP codes',
      timestamp: '2024-01-19 09:15',
      status: 'resolved'
    }
  ];

  const modelPerformance = [
    { period: 'Last 7 days', accuracy: 94.2, precision: 92.8, recall: 95.1, f1: 93.9 },
    { period: 'Last 30 days', accuracy: 93.8, precision: 92.3, recall: 94.7, f1: 93.5 },
    { period: 'Last 90 days', accuracy: 93.5, precision: 91.9, recall: 94.2, f1: 93.0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-success bg-success-light';
      case 'warning':
        return 'text-warning bg-warning-light';
      case 'fail':
        return 'text-destructive bg-destructive-light';
      default:
        return 'text-muted bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleToggleDataSource = () => {
    setIsUsingDemoData(!isUsingDemoData);
  };

  const handleUploadData = () => {
    console.log('Upload data clicked');
  };

  if (!hasUserData && !isUsingDemoData) {
    return (
      <div className="space-y-6">
        <DataSourceBanner 
          isUsingDemoData={false} 
          hasUserData={false}
          showToggle={false}
        />
        <EmptyDataState onUpload={handleUploadData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Source Banner */}
      <DataSourceBanner 
        isUsingDemoData={isUsingDemoData}
        onToggle={handleToggleDataSource}
        hasUserData={hasUserData}
        lastSync="2 minutes ago"
      />

      {/* Header */}
      <Card className="gradient-tech text-white shadow-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI Audit & Compliance Dashboard</h2>
              <p className="text-white/90">
                Monitor fairness, bias, and regulatory compliance across all loan decisions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">0.02</div>
                <div className="text-white/80 text-sm">Bias Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-white/80 text-sm">Compliance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fairness" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="fairness">Fairness Metrics</TabsTrigger>
          <TabsTrigger value="bias">Bias Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
          <TabsTrigger value="decisions">Decision Audit</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="fairness" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fairness Metrics */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Fairness Metrics</span>
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of algorithmic fairness across protected groups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fairnessMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <Badge variant="outline" className={getStatusColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(metric.value / metric.threshold) * 100} 
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        {metric.value} / {metric.threshold}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Protected Groups Analysis */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Protected Groups Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">87.2%</div>
                    <div className="text-sm text-muted-foreground">Gender Parity</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">92.1%</div>
                    <div className="text-sm text-muted-foreground">Age Equality</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">89.8%</div>
                    <div className="text-sm text-muted-foreground">Ethnic Fairness</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">94.3%</div>
                    <div className="text-sm text-muted-foreground">Geographic Equity</div>
                  </div>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All protected groups show approval rates within acceptable variance thresholds.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bias" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bias Alerts */}
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Bias Detection Alerts</span>
                  </CardTitle>
                  <CardDescription>
                    Automated alerts for potential bias in loan decisions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {biasAlerts.map((alert) => (
                    <Card key={alert.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold">{alert.metric}</div>
                            <div className="text-sm text-muted-foreground">{alert.description}</div>
                          </div>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{alert.timestamp}</span>
                          <Badge variant="outline" className={
                            alert.status === 'resolved' ? 'text-success' : 'text-warning'
                          }>
                            {alert.status}
                          </Badge>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Bias Mitigation Tools */}
            <div>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Mitigation Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full gradient-primary text-white">
                    Run Bias Test
                  </Button>
                  <Button variant="outline" className="w-full">
                    Adjust Thresholds
                  </Button>
                  <Button variant="outline" className="w-full">
                    Retrain Model
                  </Button>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Last bias audit: 2 hours ago. Next scheduled: 6 hours.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Performance Metrics */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Model Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelPerformance.map((period, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="font-semibold mb-3">{period.period}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                          <div className="text-lg font-semibold">{period.accuracy}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Precision</div>
                          <div className="text-lg font-semibold">{period.precision}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Recall</div>
                          <div className="text-lg font-semibold">{period.recall}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">F1 Score</div>
                          <div className="text-lg font-semibold">{period.f1}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Drift Detection */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Drift Detection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Data Drift</span>
                    <Badge variant="outline" className="text-success">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Concept Drift</span>
                    <Badge variant="outline" className="text-success">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Performance Drift</span>
                    <Badge variant="outline" className="text-warning">Monitoring</Badge>
                  </div>
                </div>

                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Model performance is stable. Last retrain: 7 days ago.
                  </AlertDescription>
                </Alert>

                <Button variant="outline" className="w-full">
                  Schedule Retrain
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSearch className="h-5 w-5" />
                <span>Decision Audit Trail</span>
              </CardTitle>
              <CardDescription>
                Comprehensive audit of all loan decisions with explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'DEC-2024-001', amount: 50000, decision: 'Approved', confidence: 0.92, features: 5 },
                  { id: 'DEC-2024-002', amount: 25000, decision: 'Rejected', confidence: 0.87, features: 4 },
                  { id: 'DEC-2024-003', amount: 75000, decision: 'Approved', confidence: 0.94, features: 6 }
                ].map((decision, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-semibold">{decision.id}</div>
                        <div className="text-sm text-muted-foreground">
                          ${decision.amount.toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={decision.decision === 'Approved' ? 'default' : 'destructive'}>
                        {decision.decision}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <div>Confidence: {(decision.confidence * 100).toFixed(1)}%</div>
                        <div className="text-muted-foreground">{decision.features} factors</div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Explanation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Compliance Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Monthly Fairness Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileSearch className="h-4 w-4 mr-2" />
                    Quarterly Audit Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Annual Compliance Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Model Performance Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Regulatory Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>GDPR Compliance</span>
                    <Badge variant="outline" className="text-success">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fair Credit Reporting Act</span>
                    <Badge variant="outline" className="text-success">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Equal Credit Opportunity Act</span>
                    <Badge variant="outline" className="text-success">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Ethics Framework</span>
                    <Badge variant="outline" className="text-success">Compliant</Badge>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All regulatory requirements are met. Next audit: March 2024.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditorDashboard;