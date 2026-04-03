# PB Super Agent - Architecture Explorer

A beautiful, interactive web application showcasing Pottery Barn's super agent architecture with an orchestrator + specialist model pattern.

## Quick Start

Simply open `index.html` in your web browser. No build process or server required!

```bash
# Option 1: Direct file opening
open index.html

# Option 2: Using Python's built-in server
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node's http-server
npx http-server
```

## Features

- **Interactive Architecture Explorer**: Visualize the complete multi-layer agent architecture
- **Intent Classification**: Real-time utterance analysis with brand detection and intent routing
- **Example Utterances**: Pre-loaded examples demonstrating different routing scenarios
- **11 Architecture Layers**: Explore each component in detail
- **Dynamic Highlighting**: Cards automatically highlight based on analyzed utterances
- **Responsive Design**: Works beautifully on desktop and tablet
- **Beautiful UI**: Sophisticated design using Pottery Barn's brand palette

## Architecture Layers

1. **Overview** - Full architecture at a glance
2. **Orchestrator** (Level 0) - Intent classification and routing
3. **Brand Layer** - Persona injection (NEW)
4. **Discovery Specialist** (Level 1) - Pre-purchase exploration
5. **FAQ Specialist** (Level 1) - Knowledge Q&A
6. **Checkout Specialist** (Level 1) - Transactional flows
7. **Order Tracking** (Level 1) - Post-purchase anxiety
8. **Post-Order Specialist** (Level 1) - Service flows
9. **Data Layer** - Shared sources and tools
10. **UI / Render Layer** - Brand-specific display rules (NEW)
11. **Human Escalation** - Designed exit points

## Usage

### Try Example Utterances

Click any example on the left to see how the system analyzes and routes it:

- "Which bed frame is better?" - Product comparison route
- "I need a baby shower gift" - Gift discovery route (PBK)
- "Where is my order?" - Order tracking route
- "Help me design my teen's room" - Design inspiration (PBT)
- "I want to return my rug" - Post-order return route

### Enter Custom Utterances

Type any shopper phrase and click **Analyze** to see:
- Brand detection (PB, PBK, or PBT)
- Intent classification
- Domain identification
- Routing destination with confidence score

### Explore Layers

Click on any layer in the left sidebar to view detailed information about that component.

## Key Design Principles

- **Separation of Concerns**: Routing, specialization, branding, and rendering are distinct layers
- **Brand Persona Injection**: Runs horizontally across all layers
- **UI Render Layer**: Decouples content generation from presentation
- **Human Escalation**: A designed feature, not a fallback mechanism
- **Auth Gates**: Pre-positioned at entry points for security

## File Structure

```
index.html              # Main HTML file (everything in one!)
app.js                  # JavaScript logic (utterance classification, routing)
README.md               # This file
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technology Used

- Vanilla JavaScript (no frameworks needed!)
- HTML5 semantic markup
- CSS Grid and Flexbox
- Google Fonts (DM Serif Display, DM Sans, DM Mono)

## Color Palette

- **Pottery Barn**: #7A5C3E (warm brown)
- **PB Kids**: #3D6B58 (teal)
- **PB Teen**: #3D4F6B (slate blue)
- **Orchestrator**: #534AB7 (purple)
- **Data Layer**: #993C1D (coral)
- **Human**: #854F0B (amber)
- **Background**: #F7F4EE (cream)

## Performance

- Lightweight (< 50KB minified)
- No external dependencies
- Instant load time
- Smooth animations
- Optimized scrolling

## Notes

This is a reference implementation demonstrating the architectural pattern used by Pottery Barn's super agent. The utterance classification uses regex-based pattern matching for demonstration purposes and can be enhanced with actual NLP/ML models in production.

---

Built with attention to detail. Enjoy exploring the architecture!
