import { useRef, useEffect } from 'react';
import type { VisualizationProps } from '../../../types/blockchain';

declare global {
  const p5: any;
}

export const FloodboyVisualization = ({ 
  storeData, 
  currentBlock,
  theme = 'dark' 
}: VisualizationProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);
  const propsRef = useRef({ storeData, currentBlock });

  useEffect(() => {
    propsRef.current = { storeData, currentBlock };
  }, [storeData, currentBlock]);

  useEffect(() => {
    const sketch = (p: any) => {
      p.setup = () => {
        const canvas = p.createCanvas(350, 420);
        if (sketchRef.current) {
          canvas.parent(sketchRef.current);
        }
        p.frameRate(30);
      };

      p.draw = () => {
        p.clear();
        p.background(255, 255, 255, 0);
        
        const { storeData } = propsRef.current;
        
        // Get sensor values from blockchain data
        let waterLevel = 0;
        let airLevel = 0;
        let installationHeight = 3.0; // Default 3m
        let isOnline = false;
        let isDead = false;
        
        if (storeData && storeData.sensorRecords.length > 0) {
          const latestRecord = storeData.sensorRecords[0];
          if (latestRecord && latestRecord.timestamp !== 0) {
            // Find field indices
            const waterIdx = storeData.fields.findIndex((f: any) => f.name === 'water_depth');
            const airIdx = storeData.fields.findIndex((f: any) => f.name === 'air_height');
            const installIdx = storeData.fields.findIndex((f: any) => f.name === 'installation_height');
            
            // Get values and scale them properly
            if (waterIdx >= 0 && latestRecord.values[waterIdx]) {
              waterLevel = parseInt(latestRecord.values[waterIdx]) / 1000; // Convert from mm to m
            }
            if (airIdx >= 0 && latestRecord.values[airIdx]) {
              airLevel = parseInt(latestRecord.values[airIdx]) / 1000; // Convert from mm to m
            }
            if (installIdx >= 0 && latestRecord.values[installIdx]) {
              installationHeight = parseInt(latestRecord.values[installIdx]) / 1000; // Convert from mm to m
            }
            
            // Check if sensor is online (data within last hour)
            const timestamp = parseInt(latestRecord.timestamp.toString());
            const now = Math.floor(Date.now() / 1000);
            isOnline = (now - timestamp) < 3600; // Online if data within last hour
            isDead = (now - timestamp) > 86400; // Dead if no data for 24 hours
          }
        }
        
        // Determine sensor mode based on which value is non-zero
        const sensorMode = waterLevel > 0 ? 'water' : 'air';
        
        const centerX = 150;
        const baseY = 380;
        const yOffset = -10;
        
        // Define sensor position variables
        const armY = yOffset + 136;
        const armStartX = centerX + 5;
        const armLength = 120;
        const sensorX = armStartX + armLength + 10;
        const sensorY = armY + 4;
        
        // Base/Foundation
        p.fill(75, 85, 99);
        p.rect(centerX - 30, baseY - 20, 60, 20, 2);
        p.fill(55, 65, 81);
        p.rect(centerX - 40, baseY - 5, 80, 8);
        
        // Vertical Pole
        p.fill(107, 114, 128);
        p.rect(centerX - 5, yOffset + 70, 10, 30);
        p.fill(156, 163, 175, 127);
        p.rect(centerX - 3, yOffset + 70, 6, 300);
        
        // Solar Panel Support
        p.fill(55, 65, 81);
        p.rect(centerX - 10, yOffset + 90, 20, 4);
        
        // Solar Panel
        p.push();
        p.fill(31, 41, 55);
        p.rect(centerX - 40, yOffset + 50, 80, 40, 2);
        
        // Solar cell grid
        p.stroke(55, 65, 81);
        p.strokeWeight(1);
        for (let i = 1; i < 4; i++) {
          p.line(centerX - 40 + i * 20, yOffset + 50, centerX - 40 + i * 20, yOffset + 90);
        }
        for (let i = 1; i < 3; i++) {
          p.line(centerX - 40, yOffset + 50 + i * 15, centerX + 40, yOffset + 50 + i * 15);
        }
        p.noStroke();
        
        // Solar shine effect
        p.fill(59, 130, 246, 77);
        p.rect(centerX - 40, yOffset + 50, 80, 40, 2);
        p.pop();
        
        // Horizontal Arm (telescopic)
        p.fill(107, 114, 128);
        p.rect(armStartX, armY, armLength, 8);
        p.fill(156, 163, 175, 127);
        p.rect(armStartX, armY + 2, armLength, 4);
        
        // Telescopic segments
        p.fill(124, 124, 124);
        p.rect(armStartX + 20, armY + 1, 100, 6);
        p.fill(140, 140, 140);
        p.rect(armStartX + 40, armY + 2, 80, 4);
        
        // Segment joints
        p.fill(90, 90, 90);
        for (let i = 1; i <= 3; i++) {
          p.rect(armStartX + i * 20, armY, 2, 8);
        }
        
        // Control Box
        p.fill(31, 41, 55);
        p.rect(centerX - 25, yOffset + 110, 50, 60, 3);
        p.fill(17, 24, 39);
        p.rect(centerX - 20, yOffset + 115, 40, 50, 2);
        
        // FLOODBOY text on control box
        p.push();
        p.fill(255, 255, 255, 200);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(9);
        p.textStyle(p.BOLD);
        p.text('FLOOD', centerX, yOffset + 145 - 5);
        p.text('BOY', centerX, yOffset + 157 - 5);
        p.textStyle(p.NORMAL);
        p.pop();
        
        // LED indicators
        const time = p.millis() / 1000;
        p.noStroke();
        
        // Status LEDs
        if (isDead) {
          p.fill(239, 68, 68, 204 + Math.sin(time * Math.PI * 2) * 51);
          p.circle(centerX, yOffset + 125, 8);
        } else if (isOnline) {
          p.fill(16, 185, 129, 204 + Math.sin(time * Math.PI) * 51);
          p.circle(centerX - 10, yOffset + 125, 4);
          p.fill(59, 130, 246, 204 + Math.sin(time * Math.PI * 0.8) * 51);
          p.circle(centerX, yOffset + 125, 4);
        } else {
          p.fill(245, 158, 11, 204 + Math.sin(time * Math.PI * 1.5) * 51);
          p.circle(centerX, yOffset + 125, 6);
        }
        
        // Sensor Cylinder
        p.fill(55, 65, 81);
        p.ellipse(sensorX, sensorY, 30, 50);
        p.fill(31, 41, 55);
        p.ellipse(sensorX, sensorY, 24, 44);
        
        // Sensor lens
        p.fill(17, 24, 39);
        p.circle(sensorX, sensorY + 11, 16);
        p.fill(0, 0, 0, 204);
        p.circle(sensorX, sensorY + 11, 12);
        
        // Water visualization
        const waterArea = centerX + 50;
        const sensorBottomY = sensorY + 25;
        const groundY = baseY - 5;
        const totalDistance = groundY - sensorBottomY;
        const scaleFactor = totalDistance / installationHeight;
        const waterY = groundY - (waterLevel * scaleFactor);
        
        if (sensorMode === 'water' && waterLevel > 0) {
          // Water surface
          p.noStroke();
          if (isDead) {
            p.fill(239, 68, 68, 102); // Red water when dead
          } else if (isOnline) {
            p.fill(59, 130, 246, 102); // Blue water when online
          } else {
            p.fill(245, 158, 11, 102); // Orange water when offline
          }
          p.rect(waterArea, waterY, 150, groundY - waterY);
          
          // Water level measurement
          p.stroke(255, 255, 255);
          p.strokeWeight(2);
          p.line(sensorX - 15, waterY, sensorX + 15, waterY);
          p.line(sensorX - 15, sensorBottomY, sensorX + 15, sensorBottomY);
          p.line(sensorX, sensorBottomY, sensorX, waterY);
          
          // Water level text
          p.noStroke();
          const textWidth = 50;
          const boxX = sensorX - 25;
          const boxY = (sensorBottomY + waterY) / 2 - 10;
          p.fill(255, 255, 255, 230);
          p.rect(boxX, boxY, textWidth, 20, 3);
          p.fill(59, 130, 246);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(12);
          p.text(`${waterLevel.toFixed(2)}m`, boxX + textWidth / 2, boxY + 10);
        }
        
        // Installation height indicator
        if (installationHeight > 0) {
          p.stroke(255, 255, 255, 150);
          p.strokeWeight(1);
          p.line(sensorX + 20, sensorBottomY, sensorX + 20, groundY);
          
          // Installation height text
          p.noStroke();
          const textWidth = 40;
          const boxX = sensorX + 25;
          p.fill(255, 255, 255, 230);
          p.rect(boxX, sensorY - 10, textWidth, 20, 3);
          p.fill(75, 65, 81);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(12);
          p.text(`${installationHeight.toFixed(1)}m`, boxX + textWidth / 2, sensorY);
        }
        
        // Display current block number
        if (propsRef.current.currentBlock) {
          p.push();
          p.fill(255, 255, 255, 200);
          p.textAlign(p.LEFT, p.TOP);
          p.textSize(10);
          p.text(`Block: ${propsRef.current.currentBlock}`, 10, 10);
          p.pop();
        }
      };
    };

    // Create p5 instance
    if (sketchRef.current && !p5InstanceRef.current && typeof p5 !== 'undefined') {
      p5InstanceRef.current = new p5(sketch);
    }

    // Cleanup
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div 
        ref={sketchRef}
        id="p5-container"
        className={`border-2 rounded-lg overflow-hidden ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gray-800/50' 
            : 'border-gray-300 bg-white/80'
        }`}
        style={{ 
          width: '350px', 
          height: '420px',
          background: theme === 'dark' ? 'rgba(17, 24, 39, 0.5)' : 'rgba(255, 255, 255, 0.8)'
        }}
      />
    </div>
  );
};