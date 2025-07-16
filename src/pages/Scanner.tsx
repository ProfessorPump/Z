import { useState } from 'react';
import { Camera, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Scanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setScanResult('Organic Whole Milk - 1L');
      setIsScanning(false);
    }, 2000);
  };

  const resetScan = () => {
    setScanResult(null);
  };

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Scanner</h1>
      
      <div className="space-y-6">
        {/* Scanner Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera size={20} />
              QR & Barcode Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scanResult ? (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto border-2 border-dashed border-border rounded-lg flex items-center justify-center mb-4">
                  {isScanning ? (
                    <div className="text-center">
                      <div className="animate-pulse">
                        <Camera size={48} className="mx-auto text-primary mb-2" />
                      </div>
                      <p className="text-sm text-muted-foreground">Scanning...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera size={48} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Point camera at code</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={simulateScan} 
                    disabled={isScanning}
                    className="w-full"
                  >
                    {isScanning ? 'Scanning...' : 'Start Scanner'}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Image size={16} className="mr-2" />
                    Upload from Gallery
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Product scanned successfully!
                  </AlertDescription>
                </Alert>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Product Found:</h3>
                  <p className="text-foreground">{scanResult}</p>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full">
                    Add to Shopping List
                  </Button>
                  <Button variant="outline" className="w-full">
                    Find Recipes
                  </Button>
                  <Button variant="ghost" onClick={resetScan} className="w-full">
                    Scan Another
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Scan barcodes or QR codes on food products to quickly add them to your shopping list or find related recipes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Scanner;