# FloodBoy Web Application - Open Source Dashboard

## Overview

This is the **open source web application** for FloodBoy, an advanced IoT-based flood monitoring system developed by the **Climate Change Data Center (CCDC)** at Chiang Mai University since **2014**. 

**This Web Application:**
- **Powered by**: Cat Lab
- **Sponsored by**: LarisLabs
- **Status**: Open source and seeking additional sponsors

**The FloodBoy Project:**
- **Developed by**: CCDC, Chiang Mai University
- **Hardware**: IoT sensors with real-time monitoring capabilities

กลุ่มวิจัย CCDC นำร่องพัฒนาเซ็นเซอร์ติดตามเฝ้าระวังและแจ้งเตือนน้ำท่วมขัง แบบเรียลไทม์ เพื่อสร้างการรับรู้ สนับสนุนข้อมูลภาครัฐ เตรียมความพร้อมรับมือภัยพิบัติ และส่งเสริมการปรับตัวของสังคม โดยวางแผนใน Beta Version เริ่มต้นทดสอบและนำใช้งานจริงภายในสิ้นปี 2567 นี้

## Web Application Features

### Blockchain Integration
- **Multi-chain Support**: 
  - JIBCHAIN L1 (Chain ID: 8899)
  - SiChang (Chain ID: 700011)
  - DustBoy IoT (Chain ID: 555888) - Coming soon
  - Local Anvil (Chain ID: 31337)
- **Smart Contract Dashboard**: Browse all deployed IoT sensor stores
- **Store Explorer**: View individual sensor configurations and metadata
- **Multicall Optimization**: Efficient batch reading of blockchain data
- **Factory Contract**: `0x904f1CCDb682f0E7b82387190C0EbF9015152BE7` on JIBCHAIN

### Data Visualization
- **P5.js Visualizations**: Interactive sensor data displays
- **Chart.js Integration**: Time-series graphs for historical data
- **Custom FloodBoy Visualizer**: Real-time water level animations
- **Responsive Tables**: Modern, mobile-friendly data tables

### Interactive Simulator
- **Sensor Simulator**: Test and understand how FloodBoy sensors work
- **Water Level Controls**: Simulate different flood scenarios
- **Air Distance Mode**: Switch between water and air distance measurements
- **Preset Scenarios**: Normal, flooding, dry, offline, and dead sensor states
- **Calibration Features**: Understand sensor calibration process

### Available Pages
- `/` - Dashboard (currently in development)
- `/blockchain` - Browse all deployed sensor stores
- `/blockchain/[address]` - View individual store data
- `/simulator` - Interactive sensor simulator
- `/sensors` - Sensor monitoring (coming soon)
- `/analytics` - Analytics dashboard (coming soon)
- `/blog` - Project updates and news
- `/about` - About FloodBoy and sponsors

### Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Modern, utility-first styling
- **Loading States**: Smooth skeleton loaders for async data
- **Error Handling**: Graceful error states and fallbacks
- **System Info Display**: Git commit hash and deployment info

## FloodBoy Sensor Specifications

- **Hardware**: Custom IoT sensors with microwave radar technology
- **Power**: Solar cell with battery backup system
- **Connectivity**: Cellular/WiFi data transmission
- **Backend**: Cloud server infrastructure
- **Frontend**: Web-based dashboard for real-time visualization
- **AI/ML**: Predictive analytics for flood forecasting

## System Specifications

### Web Application
| Feature | Specification |
|---------|--------------|
| Framework | Astro with React components |
| Blockchain Library | Viem |
| Styling | Tailwind CSS |
| Visualization | P5.js, Chart.js |
| Deployment | Cloudflare Workers |
| Multi-chain | Yes (3 networks) |
| TypeScript | Full support |

### FloodBoy Sensors
| Feature | Specification |
|---------|--------------|
| Measurement Accuracy | ±2mm |
| Data Update Interval | 1 minute |
| Power Source | Solar + Battery |
| Operating Duration | 30 days (without sun) |
| Communication | Real-time online |
| Installation | Plug-and-play |
| Development Period | Since 2014 |

## Installation & Deployment

### Web Application Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/floodboy-astro.git
   cd floodboy-astro
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Build for Production**
   ```bash
   pnpm build
   ```

5. **Deploy to Cloudflare**
   ```bash
   pnpm run deploy
   ```

### Blockchain Configuration
To connect to different blockchain networks:
1. Edit `src/config/blockchain.config.ts`
2. Update RPC endpoints and chain IDs
3. Deploy your own factory contract if needed

## Usage

### Dashboard Features
- **Store Browser**: View all deployed IoT sensor stores
- **Store Details**: Inspect individual sensor configurations
- **Interactive Simulator**: Test sensor behavior
- **Blog Section**: Stay updated with project news
- **Multi-chain Support**: Switch between different blockchain networks

### Mobile Access
The web application is fully responsive and optimized for:
- iOS/Android browsers
- Tablets and iPads
- Desktop computers

## Version History

- **2014**: Initial FloodBoy sensor development by CCDC
- **2014-2023**: Continuous sensor improvements and field testing
- **2024**: FloodBoy sensors production ready by CCDC
- **2025**: Open source web application launched by Cat Lab
- **2025 (2568)**: Web application deployment with multi-chain support

## Contributing

We welcome contributions to the FloodBoy web application! 

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure responsive design
- Use TypeScript for new code

## Acknowledgments

### Web Application Development
- **Powered By**: Cat Lab - Web application development and infrastructure
- **Current Sponsor**: LarisLabs - Primary sponsor for the web application

### FloodBoy Sensor Project
- **Lead Developer**: Nat Weerawan (PhD Student, Climate Change Management Program)
- **Principal Investigator**: Assoc. Prof. Dr. Sate Sampattagul
- **Institution**: Climate Change Data Center (CCDC), Chiang Mai University

### Technology Partners
- Claude AI
- Claude Code
- GitHub Copilot

### Call for Sponsors
We are actively seeking additional sponsors to support the development and maintenance of this open source web application. Your support will help us:
- Enhance dashboard features
- Improve real-time data visualization
- Scale infrastructure for more sensors
- Develop mobile applications
- Implement advanced AI predictions

Contact us for sponsorship opportunities!

## Institutional Support

- **Chiang Mai University** - Host institution
- **UNISERV** - Academic service unit
- **3E Research Unit** - Energy and Environmental Management
- **MIdS School** - Integrated Sciences Program

## Impact

FloodBoy has been successfully deployed across Northern Thailand, including:
- Don Chan area flood monitoring points
- Sri Ping Mueang community
- Mae On District risk areas
- Mae Fah Luang University dormitory areas

The system enhances community resilience by providing:
- Early warning capabilities
- Data-driven decision support
- Historical flood pattern analysis
- Real-time situation awareness

## Related Projects

- **#DustBoy** - Air quality monitoring system by CCDC
- **#FloodBoy** - This flood monitoring system
- **#CCDC** - Climate Change Data Center initiatives

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Funding & Support

### For FloodBoy Web Application by Cat Lab
This open source web application welcomes sponsors! Support options include:
- Corporate sponsorship
- Technical partnerships  
- Infrastructure support
- Development contributions

### Call for Sponsors
Cat Lab and LarisLabs are open for funding to support the development and maintenance of this open source FloodBoy web application:
- **ETH Wallet**: `0x1D7EF8bF25CF7575cD220c33E8b20c02c491261b`

Your sponsorship will help us improve the dashboard, add new features, and maintain the infrastructure.

For sponsorship opportunities, please contact us.

## Contact

For more information about FloodBoy or deployment inquiries:

**Climate Change Data Center (CCDC)**  
Chiang Mai University  
Email: ccdc@cmu.ac.th  
Website: [https://cmuccdc.org](https://cmuccdc.org)  
Facebook: [https://www.facebook.com/cmu.ccdc](https://www.facebook.com/cmu.ccdc)

---

**FloodBoy Web Application - Open Source Dashboard for Flood Monitoring**  
FloodBoy Sensors by CMU CCDC | Web App Powered by Cat Lab | Sponsored by LarisLabs  
*We welcome additional sponsors!*