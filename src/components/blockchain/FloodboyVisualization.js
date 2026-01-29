/**
 * FloodBoy Sensor Visualization Component
 * p5.js-based animated sensor visualization showing water level and sensor status
 */

export function createFloodboyVisualization(React) {
  return function FloodboyVisualization({ waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead }) {
    const sketchRef = React.useRef(null);
    const p5InstanceRef = React.useRef(null);
    const propsRef = React.useRef({ waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead });

    React.useEffect(() => {
      propsRef.current = { waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead };
    }, [waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead]);

    React.useEffect(() => {
      const sketch = (p) => {
        p.setup = () => {
          const canvas = p.createCanvas(350, 420);
          canvas.parent(sketchRef.current);
          p.frameRate(30);
        };

        p.draw = () => {
          p.clear();
          p.background(255, 255, 255, 0);

          const { waterLevel: currentWaterLevel, airLevel: currentAirLevel, sensorMode: currentSensorMode,
                  installationHeight: currentInstallationHeight, showMeasurement: currentShowMeasurement,
                  isOnline, isDead } = propsRef.current;

          const centerX = 150, baseY = 380, yOffset = -10;
          const armY = yOffset + 136, armStartX = centerX + 5, armLength = 120;
          const sensorX = armStartX + armLength + 10, sensorY = armY + 4;

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

          // Solar Panel Support & Panel
          p.fill(55, 65, 81);
          p.rect(centerX - 10, yOffset + 90, 20, 4);
          p.push();
          p.fill(31, 41, 55);
          p.rect(centerX - 40, yOffset + 50, 80, 40, 2);
          p.stroke(55, 65, 81);
          p.strokeWeight(1);
          for (let i = 1; i < 4; i++) p.line(centerX - 40 + i * 20, yOffset + 50, centerX - 40 + i * 20, yOffset + 90);
          for (let i = 1; i < 3; i++) p.line(centerX - 40, yOffset + 50 + i * 15, centerX + 40, yOffset + 50 + i * 15);
          p.noStroke();
          p.fill(59, 130, 246, 77);
          p.rect(centerX - 40, yOffset + 50, 80, 40, 2);
          p.pop();

          // Horizontal Arm (telescopic)
          p.fill(107, 114, 128);
          p.rect(armStartX, armY, armLength, 8);
          p.fill(156, 163, 175, 127);
          p.rect(armStartX, armY + 2, armLength, 4);
          p.fill(124, 124, 124);
          p.rect(armStartX + 20, armY + 1, 100, 6);
          p.fill(140, 140, 140);
          p.rect(armStartX + 40, armY + 2, 80, 4);
          p.fill(90, 90, 90);
          for (let i = 1; i <= 3; i++) p.rect(armStartX + i * 20, armY, 2, 8);

          // Control Box
          p.fill(31, 41, 55);
          p.rect(centerX - 25, yOffset + 110, 50, 60, 3);
          p.fill(17, 24, 39);
          p.rect(centerX - 20, yOffset + 115, 40, 50, 2);
          p.push();
          p.fill(255, 255, 255, 200);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(9);
          p.textStyle(p.BOLD);
          p.text('FLOOD', centerX, yOffset + 145);
          p.text('BOY', centerX, yOffset + 157);
          p.textStyle(p.NORMAL);
          p.pop();

          // LED indicators
          const time = p.millis() / 1000;
          p.noStroke();
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
          p.fill(17, 24, 39);
          p.circle(sensorX, sensorY + 11, 16);
          p.fill(0, 0, 0, 204);
          p.circle(sensorX, sensorY + 11, 12);

          // Water mode visualization
          if (currentSensorMode === 'water' && currentShowMeasurement) {
            const waterArea = centerX + 50;
            const visualWaterLevel = Math.min(currentWaterLevel, currentInstallationHeight);
            const isOverflow = currentWaterLevel > currentInstallationHeight;
            const sensorBottomY = sensorY + 25;
            const groundY = baseY - 5;
            const totalDistance = groundY - sensorBottomY;
            const scaleFactor = totalDistance / currentInstallationHeight;
            const waterY = groundY - (visualWaterLevel * scaleFactor);

            if (currentWaterLevel > 0) {
              p.noStroke();
              p.fill(isDead ? [239, 68, 68, 102] : isOnline ? [59, 130, 246, 102] : [245, 158, 11, 102]);
              p.rect(waterArea, waterY, 150, groundY - waterY);

              p.stroke(isDead ? [239, 68, 68] : isOnline ? [59, 130, 246] : [245, 158, 11]);
              p.strokeWeight(2);
              p.noFill();
              p.beginShape();
              for (let x = 0; x <= 150; x += 5) {
                p.vertex(waterArea + x, waterY + Math.sin((x + time * 50) * 0.05) * 2);
              }
              p.endShape();

              // Ripples
              for (let i = 0; i < 3; i++) {
                const rippleTime = (time * 1.5 + i * 0.8) % 3;
                const rippleAlpha = Math.max(0, 1 - rippleTime / 3) * 77;
                if (rippleAlpha > 0) {
                  p.noFill();
                  p.stroke(isDead ? [239, 68, 68, rippleAlpha] : isOnline ? [59, 130, 246, rippleAlpha] : [245, 158, 11, rippleAlpha]);
                  p.strokeWeight(1.5 - rippleTime * 0.5);
                  p.ellipse(sensorX, waterY, (5 + rippleTime * 20) * 2, (5 + rippleTime * 20) * 0.5);
                }
              }
            }

            // Measurement line
            p.stroke(59, 130, 246, 153);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([4, 4]);
            p.line(sensorX, sensorY + 20, sensorX, currentWaterLevel > 0 ? waterY : baseY - 5);
            p.drawingContext.setLineDash([]);

            // Label
            p.noStroke();
            p.fill(isDead ? [239, 68, 68] : isOnline ? [59, 130, 246] : [245, 158, 11]);
            const labelY = visualWaterLevel > 0 ? waterY + 20 : baseY - 30;
            if (isOverflow) {
              p.fill(239, 68, 68);
              p.textAlign(p.CENTER, p.CENTER);
              p.text(currentWaterLevel.toFixed(2) + 'm ⚠️', waterArea + 75, labelY);
              p.textSize(10);
              p.text(`Exceeds ${currentInstallationHeight.toFixed(2)}m range`, waterArea + 75, labelY + 15);
              p.textSize(12);
            } else {
              p.textAlign(p.LEFT, p.CENTER);
              p.text(currentWaterLevel.toFixed(2) + 'm', sensorX + 5, labelY);
            }
          }

          // Installation height indicator
          if (currentInstallationHeight > 0) {
            p.stroke(156, 163, 175, 100);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([2, 2]);
            p.line(sensorX, sensorY + 25, sensorX, baseY - 5);
            p.drawingContext.setLineDash([]);
            p.line(sensorX - 5, sensorY + 25, sensorX + 5, sensorY + 25);
            p.line(sensorX - 5, baseY - 5, sensorX + 5, baseY - 5);

            p.noStroke();
            const textWidth = 40;
            const boxX = sensorX + 20;
            p.fill(255, 255, 255, 230);
            p.rect(boxX, sensorY - 10, textWidth, 20, 3);
            p.fill(75, 65, 81);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(12);
            p.text(`${currentInstallationHeight.toFixed(2)}m`, boxX + textWidth / 2, sensorY);
          }

          p.noStroke();
        };
      };

      if (sketchRef.current && !p5InstanceRef.current && typeof window !== 'undefined' && window.p5) {
        p5InstanceRef.current = new window.p5(sketch, sketchRef.current);
      }

      return () => {
        if (p5InstanceRef.current) {
          p5InstanceRef.current.remove();
          p5InstanceRef.current = null;
        }
      };
    }, []);

    React.useEffect(() => {
      if (p5InstanceRef.current) p5InstanceRef.current.redraw();
    }, [waterLevel, airLevel, sensorMode, installationHeight, showMeasurement, isOnline, isDead]);

    return React.createElement('div', { ref: sketchRef, id: 'p5-container', style: { width: '350px', height: '420px', margin: '0 auto' } });
  };
}
