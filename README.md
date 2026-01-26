# Dot Brief Builder

Hunch brief builder service. Takes brief data as JSON, renders an interactive editor, exports to PDF.

## Stage 1: Static Brief Builder ✅

- Interactive HTML form with three pages (Brief, Springboard, Detail)
- JSON input/output for integration with Dot
- PDF export via WeasyPrint
- Strategy fields sync between pages
- Toggleable detail sections + custom sections

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Interactive brief editor |
| `/api/brief` | GET | Returns blank brief JSON structure |
| `/api/brief` | POST | Load brief from JSON |
| `/api/pdf` | POST | Generate PDF from brief JSON |
| `/health` | GET | Health check |

## JSON Schema

```json
{
  "meta": {
    "jobName": "TOW 088 | 90-Day Pre Renewal",
    "projectLead": "Emma",
    "hunchLead": "Michael",
    "date": "27 Jan – v1",
    "version": 1
  },
  "topline": {
    "need": "What problem are we solving?",
    "objectives": "What does success look like?",
    "outputs": "What are we actually making?",
    "dates": "When do things need to happen?"
  },
  "springboard": {
    "q1": "What's actually going on?",
    "q2": "Who do we need to convince?",
    "q3": "Why will anyone care?",
    "q4": "What's holding them back?"
  },
  "strategy": {
    "hunch": "The strategic unlock",
    "get": "Who are we trying to move?",
    "to": "What do we want them to do?",
    "by": "How will we make that happen?"
  },
  "detail": {
    "proofPoints": "",
    "mandatories": "",
    "questions": "",
    "research": "",
    "appendix": "",
    "customSections": []
  },
  "settings": {
    "showProofPoints": true,
    "showMandatories": true,
    "showQuestions": true,
    "showResearch": false,
    "showAppendix": false
  }
}
```

## Dot Integration

Dot can:
1. Extract brief info from client input → generate JSON
2. POST JSON to `/api/brief` to pre-populate the form
3. Refine strategy through conversation → update JSON
4. POST final JSON to `/api/pdf` to generate output

## Roadmap

### Stage 2: Guided Conversation
- Claude API integration
- Structured flow through Springboard questions
- Push-back and refinement on each answer
- "Lock in" progression

### Stage 3: Intake + Intelligence  
- Upload client doc/email
- Claude extracts and pre-fills
- Flags gaps and weaknesses

### Stage 4: Memory + Learning
- Learn from past briefs
- Client history and preferences
- Pattern recognition

## Local Development

```bash
pip install -r requirements.txt
python app.py
```

## Deploy to Railway

Push to GitHub, connect repo to Railway. Uses `nixpacks.toml` for dependencies.
