import React, { useEffect, useRef } from 'react';

interface FloodboyVisualizationProps {
  waterLevel: number;
  airLevel: number;
  sensorMode: 'water' | 'air';
  installationHeight: number;
  showMeasurement: boolean;
  isOnline: boolean;
  isDead: boolean;
}

// Global declaration for p5
declare global {
  interface Window {
    p5: any;
  }
}

const FloodboyVisualization: React.FC<FloodboyVisualizationProps> = ({
  waterLevel,
  airLevel,
  sensorMode,
  installationHeight = 2.5,
  showMeasurement = true,
  isOnline = true,
  isDead = false
}) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);
  const propsRef = useRef({ waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead });

  // Update props ref
  useEffect(() => {
    propsRef.current = { waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead };
  }, [waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead]);

  useEffect(() => {
    const sketch = (p: any) => {
      p.setup = () => {
        const canvas = p.createCanvas(350, 420);
        canvas.parent(sketchRef.current);
        p.frameRate(30);
      };

      p.draw = () => {
        p.clear();
        p.background(255, 255, 255, 0);
        
        // Get current props
        const { 
          waterLevel: currentWaterLevel, 
          airLevel: currentAirLevel, 
          sensorMode: currentSensorMode, 
          installationHeight: currentInstallationHeight, 
          showMeasurement: currentShowMeasurement, 
          isOnline, 
          isDead 
        } = propsRef.current;
        
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
        
        // FLOODBOY text on control box (two lines)
        p.push(); // Save current state
        p.fill(255, 255, 255, 200);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(9);
        p.textStyle(p.BOLD);
        // Make sure text is centered on the control box
        const boxCenterX = centerX; // Control box is already centered at centerX
        p.text('FLOOD', boxCenterX, yOffset + 145);
        p.text('BOY', boxCenterX, yOffset + 157);
        p.textStyle(p.NORMAL);
        p.pop(); // Restore state
        
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
        
        // Measurement visualization
        if (currentSensorMode === 'air' && currentShowMeasurement) {
          // Air measurement visualization
          const pulsePhase = (time * 2) % 4;
          const measurementDistance = baseY - 5 - (sensorY + 20);
          
          // Animated measurement pulse
          for (let i = 0; i < 3; i++) {
            const offset = i * 1.2;
            const alpha = Math.max(0, 1 - (pulsePhase + offset) / 4) * 153;
            
            if (alpha > 0) {
              p.stroke(59, 130, 246, alpha);
              p.strokeWeight(2 - i * 0.5);
              
              const pulseProgress = ((pulsePhase + offset) % 4) / 4;
              const startY = sensorY + 20;
              const endY = startY + measurementDistance * Math.min(pulseProgress * 1.2, 1);
              
              p.drawingContext.setLineDash([6, 6]);
              p.line(sensorX, startY, sensorX, endY);
              p.drawingContext.setLineDash([]);
            }
          }
          
          // Distance label
          p.noStroke();
          p.fill(255, 255, 255, 230);
          p.rect(sensorX + 10, armY + 100, 55, 24, 3);
          p.fill(239, 68, 68);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(16);
          p.text(currentAirLevel.toFixed(2) + 'm', sensorX + 37.5, armY + 112);
          
        } else if (currentSensorMode === 'water' && currentShowMeasurement) {
          // Water mode
          const waterArea = centerX + 50;
          // Calculate water Y position - when water level = installation height, water should reach sensor
          // The sensor is at sensorY + 25 (bottom of sensor)
          // Scale factor = distance from base to sensor bottom / installation height
          const sensorBottomY = sensorY + 25;
          const groundY = baseY - 5;
          const totalDistance = groundY - sensorBottomY;
          const scaleFactor = totalDistance / currentInstallationHeight;
          const waterY = groundY - (currentWaterLevel * scaleFactor);
          
          if (currentWaterLevel > 0) {
            // Water surface
            p.noStroke();
            // Red when dead, blue when online, orange when offline
            if (isDead) {
              p.fill(239, 68, 68, 102); // Red water when dead
            } else if (isOnline) {
              p.fill(59, 130, 246, 102); // Blue water when online
            } else {
              p.fill(245, 158, 11, 102); // Orange water when offline
            }
            p.rect(waterArea, waterY, 150, groundY - waterY);
            
            // Water surface line with wave animation
            // Red when dead, blue when online, orange when offline
            if (isDead) {
              p.stroke(239, 68, 68); // Red water line when dead
            } else if (isOnline) {
              p.stroke(59, 130, 246); // Blue water line when online
            } else {
              p.stroke(245, 158, 11); // Orange water line when offline
            }
            p.strokeWeight(2);
            p.noFill();
            p.beginShape();
            for (let x = 0; x <= 150; x += 5) {
              const waveY = waterY + Math.sin((x + time * 50) * 0.05) * 2;
              p.vertex(waterArea + x, waveY);
            }
            p.endShape();
            
            // Animated ripples at measurement point
            for (let i = 0; i < 3; i++) {
              const rippleTime = (time * 1.5 + i * 0.8) % 3;
              const rippleRadius = 5 + rippleTime * 20;
              const rippleAlpha = Math.max(0, 1 - rippleTime / 3) * 77;
              
              if (rippleAlpha > 0) {
                p.noFill();
                // Red when dead, blue when online, orange when offline
                if (isDead) {
                  p.stroke(239, 68, 68, rippleAlpha); // Red ripples when dead
                } else if (isOnline) {
                  p.stroke(59, 130, 246, rippleAlpha); // Blue ripples when online
                } else {
                  p.stroke(245, 158, 11, rippleAlpha); // Orange ripples when offline
                }
                p.strokeWeight(1.5 - rippleTime * 0.5);
                p.ellipse(sensorX, waterY, rippleRadius * 2, rippleRadius * 0.5);
              }
            }
          } else {
            // Dry floor
            p.noStroke();
            p.fill(139, 115, 85, 204);
            p.rect(waterArea, baseY - 5, 150, 5);
            
            // Floor texture
            p.fill(160, 130, 109, 127);
            for (let x = 0; x < 150; x += 20) {
              p.rect(waterArea + x, baseY - 5, 10, 5);
            }
            
            // Impact waves on dry floor
            for (let i = 0; i < 3; i++) {
              const waveTime = (time * 2 + i * 0.7) % 3;
              const waveRadius = 5 + waveTime * 15;
              const waveAlpha = Math.max(0, 1 - waveTime / 3) * 102;
              
              if (waveAlpha > 0) {
                p.noFill();
                p.stroke(59, 130, 246, waveAlpha);
                p.strokeWeight(2 - waveTime * 0.5);
                p.circle(sensorX, baseY - 5, waveRadius * 2);
              }
            }
          }
          
          // Measurement line
          p.stroke(59, 130, 246, 153);
          p.strokeWeight(1);
          p.drawingContext.setLineDash([4, 4]);
          p.line(sensorX, sensorY + 20, sensorX, currentWaterLevel > 0 ? waterY : baseY - 5);
          p.drawingContext.setLineDash([]);
          
          // Distance label
          p.noStroke();
          // Red when dead, blue when online, orange when offline
          if (isDead) {
            p.fill(239, 68, 68); // Red label when dead
          } else if (isOnline) {
            p.fill(59, 130, 246); // Blue label when online
          } else {
            p.fill(245, 158, 11); // Orange label when offline
          }
          p.textAlign(p.LEFT, p.CENTER);
          // Position label closer to water surface
          const labelY = currentWaterLevel > 0 ? waterY + 20 : baseY - 30;
          p.text(currentWaterLevel.toFixed(2) + 'm', sensorX + 5, labelY);
        }
        
        // Display installation height and constraint indicators
        if (currentInstallationHeight > 0) {
          // Draw a subtle line showing installation height - directly under the sensor
          p.stroke(156, 163, 175, 100); // Light gray
          p.strokeWeight(1);
          p.drawingContext.setLineDash([2, 2]);
          p.line(sensorX, sensorY + 25, sensorX, baseY - 5);
          p.drawingContext.setLineDash([]);
          
          // Small markers at top and bottom
          p.line(sensorX - 5, sensorY + 25, sensorX + 5, sensorY + 25);
          p.line(sensorX - 5, baseY - 5, sensorX + 5, baseY - 5);
          
          // Draw max water level indicator line (installation height from base)
          // Only show when water level is at or very close to max
          if (currentSensorMode === 'water' && Math.abs(currentWaterLevel - currentInstallationHeight) < 0.01) {
            const waterArea = centerX + 50; // Define waterArea here
            // Use same calculation as water rendering to get the actual water Y position
            const sensorBottomY = sensorY + 25;
            const groundY = baseY - 5;
            const totalDistance = groundY - sensorBottomY;
            const scaleFactor = totalDistance / currentInstallationHeight;
            const waterY = groundY - (currentWaterLevel * scaleFactor);
            
            // Draw MAX indicator at the water surface
            p.stroke(239, 68, 68, 80); // Red line for max water level
            p.strokeWeight(2);
            p.drawingContext.setLineDash([5, 5]);
            p.line(waterArea - 10, waterY, waterArea + 160, waterY);
            p.drawingContext.setLineDash([]);
            
            // Label for max level - positioned below the installation height text
            p.noStroke();
            p.fill(239, 68, 68, 150);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(10);
            // Position MAX below the installation height label (which is at sensorY)
            const boxX = sensorX + 20; // Same X as installation height box
            const textWidth = 40; // Same width as installation height box
            p.text('(MAX)', boxX + textWidth/2, sensorY + 15);
          }
          
          p.noStroke();
          
          // Background box for better readability - positioned to fit within canvas
          const textWidth = 40;
          const boxX = sensorX + 20; // Position to the right of sensor
          p.fill(255, 255, 255, 230);
          p.rect(boxX, sensorY - 10, textWidth, 20, 3);
          
          // Installation height text
          p.fill(75, 65, 81); // Dark gray to match sensor color
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(12);
          p.text(`${currentInstallationHeight.toFixed(1)}m`, boxX + textWidth/2, sensorY);
        }
        
        p.noStroke();
      };
    };

    // Create p5 instance
    if (sketchRef.current && !p5InstanceRef.current && typeof window !== 'undefined' && window.p5) {
      p5InstanceRef.current = new window.p5(sketch, sketchRef.current);
    }

    // Cleanup
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  // Update visualization when props change
  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.redraw();
    }
  }, [waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead]);

  return (
    <div 
      ref={sketchRef} 
      id="p5-container" 
      style={{ 
        width: '350px', 
        height: '420px',
        margin: '0 auto'
      }}
    />
  );
};

export default FloodboyVisualization;