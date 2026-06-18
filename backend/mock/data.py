"""
Mock data — Python port of src/lib/mock-data/data.ts.

Kept in its own file so it is easy to swap out without touching any
route handler or business logic. Data is never hardcoded inline in handlers.
"""

from __future__ import annotations

# ── Recent Investigations ─────────────────────────────────────────────────────

RECENT_INVESTIGATIONS = [
    {
        "id": "inv-1",
        "title": "OpenAI Core Structure & Investment Web",
        "searchTerm": "OpenAI",
        "timestamp": "2 hours ago",
        "status": "Completed",
        "entityCount": 14,
        "relationshipCount": 28,
    },
    {
        "id": "inv-2",
        "title": "Microsoft Corporate Entities & Infrastructure",
        "searchTerm": "Microsoft",
        "timestamp": "5 hours ago",
        "status": "Completed",
        "entityCount": 18,
        "relationshipCount": 36,
    },
    {
        "id": "inv-3",
        "title": "xAI & Neuralink Executive Mapping",
        "searchTerm": "Neuralink",
        "timestamp": "1 day ago",
        "status": "Completed",
        "entityCount": 12,
        "relationshipCount": 18,
    },
    {
        "id": "inv-4",
        "title": "Google DeepMind UK Org Structure",
        "searchTerm": "Google",
        "timestamp": "2 days ago",
        "status": "Completed",
        "entityCount": 22,
        "relationshipCount": 45,
    },
]

# ── Metrics ───────────────────────────────────────────────────────────────────

MOCK_METRICS: dict[str, dict] = {
    "openai": {"totalEntities": 14, "relationshipsFound": 28, "sourcesAnalyzed": 142, "confidenceScore": 94},
    "microsoft": {"totalEntities": 18, "relationshipsFound": 36, "sourcesAnalyzed": 284, "confidenceScore": 97},
    "google": {"totalEntities": 22, "relationshipsFound": 45, "sourcesAnalyzed": 412, "confidenceScore": 95},
    "default": {"totalEntities": 8, "relationshipsFound": 12, "sourcesAnalyzed": 45, "confidenceScore": 82},
}

# ── AI Summaries ──────────────────────────────────────────────────────────────

MOCK_AI_SUMMARIES: dict[str, dict] = {
    "openai": {
        "target": "OpenAI",
        "summary": (
            "OpenAI is a major research organization and commercial entity in the artificial intelligence space. "
            "Founded in 2015 as a non-profit, it restructured into a capped-profit model in 2019 to attract "
            "venture capital. Its chief financial backer and close cloud service partner is Microsoft, which "
            "holds a significant minority stake."
        ),
        "keyInsights": [
            "Sam Altman holds key executive influence as CEO and primary spokesperson.",
            "Significant data flow and infrastructure dependencies exist on Microsoft Azure cloud services.",
            "Key products ChatGPT and GPT-4 represent the core commercial offerings, driving over 80% of current revenue.",
        ],
    },
    "microsoft": {
        "target": "Microsoft",
        "summary": (
            "Microsoft Corporation is a multinational technology conglomerate headquartered in Redmond, Washington. "
            "The organization has positioned itself as a primary leader in generative AI through its strategic "
            "partnership and cloud hosting agreement with OpenAI, integrating advanced LLM capabilities directly "
            "into its Azure, Windows, and Office suites."
        ),
        "keyInsights": [
            "Azure Cloud infrastructure serves as the exclusive host for OpenAI research and production workloads.",
            "Satya Nadella has expanded corporate reach through aggressive acquisitions, notably GitHub, LinkedIn, and Activision Blizzard.",
            "Corporate structure shows direct reporting lines of AI integration branches back to the Redmond headquarters.",
        ],
    },
    "google": {
        "target": "Google",
        "summary": (
            "Google LLC (Alphabet Inc.) is an international search and cloud computing company. Google has merged "
            "its Google Brain and DeepMind divisions to centralize its generative AI research. Its Gemini model "
            "serves as the core foundation for search, workspace integrations, and cloud enterprise services."
        ),
        "keyInsights": [
            "DeepMind operates as a semi-autonomous division primarily in London, UK.",
            "Substantial compute resource allocations are channeled directly through Google Cloud TPU clusters.",
            "Gemini model family has been deeply integrated into the flagship search and advertisement delivery pipeline.",
        ],
    },
    "default": {
        "target": "Target Entity",
        "summary": (
            "AI-generated intelligence summary will appear here after backend integration. "
            "A mock investigation has been performed for this entity to simulate the analytical flow."
        ),
        "keyInsights": [
            "Analyzing public records, filings, and open-source intelligence.",
            "Scanning for corporate structures, parent companies, and major stakeholders.",
            "Mapping executive directories, registered office locations, and product dependencies.",
        ],
    },
}

# ── Entities ──────────────────────────────────────────────────────────────────

MOCK_ENTITIES: dict[str, list[dict]] = {
    "openai": [
        {"id": "oe-1", "name": "OpenAI", "type": "Company", "description": "AI research and deployment company", "confidenceScore": 99, "tags": ["AI", "Tech"]},
        {"id": "oe-2", "name": "Sam Altman", "type": "Person", "description": "CEO of OpenAI", "confidenceScore": 99, "tags": ["Executive", "Founder"]},
        {"id": "oe-3", "name": "Greg Brockman", "type": "Person", "description": "President and Co-founder of OpenAI", "confidenceScore": 98, "tags": ["Executive", "Technical"]},
        {"id": "oe-4", "name": "Ilya Sutskever", "type": "Person", "description": "Former Chief Scientist and Co-founder", "confidenceScore": 99, "tags": ["Research", "Founder"]},
        {"id": "oe-5", "name": "ChatGPT", "type": "Product", "description": "Conversational AI interface", "confidenceScore": 99, "tags": ["LLM", "Product"]},
        {"id": "oe-6", "name": "GPT-4", "type": "Product", "description": "Multimodal large language model", "confidenceScore": 99, "tags": ["LLM", "Model"]},
        {"id": "oe-7", "name": "Microsoft", "type": "Company", "description": "Multinational technology corporation and primary partner", "confidenceScore": 99, "tags": ["Investor", "Cloud"]},
        {"id": "oe-8", "name": "San Francisco", "type": "Location", "description": "Headquarters location of OpenAI", "confidenceScore": 95, "tags": ["HQ", "California"]},
        {"id": "oe-9", "name": "OpenAI DevDay", "type": "Event", "description": "Annual developer conference", "confidenceScore": 95, "tags": ["Conference", "Developers"]},
        {"id": "oe-10", "name": "Y Combinator", "type": "Organization", "description": "Startup accelerator that incubated Sam Altman", "confidenceScore": 92, "tags": ["Venture Capital", "Accelerator"]},
        {"id": "oe-11", "name": "Mira Murati", "type": "Person", "description": "CTO of OpenAI", "confidenceScore": 97, "tags": ["Executive", "Technical"]},
        {"id": "oe-12", "name": "Sora", "type": "Product", "description": "AI video generation model", "confidenceScore": 96, "tags": ["Generative Video", "Product"]},
        {"id": "oe-13", "name": "DALL-E", "type": "Product", "description": "AI image generation model", "confidenceScore": 98, "tags": ["Generative Image", "Product"]},
        {"id": "oe-14", "name": "Safe Superintelligence Inc. (SSI)", "type": "Company", "description": "AI safety startup founded by Ilya Sutskever", "confidenceScore": 94, "tags": ["Startup", "AI Safety"]},
    ],
    "microsoft": [
        {"id": "me-1", "name": "Microsoft", "type": "Company", "description": "Multinational software and cloud giant", "confidenceScore": 99, "tags": ["Enterprise", "Tech"]},
        {"id": "me-2", "name": "Satya Nadella", "type": "Person", "description": "CEO of Microsoft", "confidenceScore": 99, "tags": ["Executive", "Leader"]},
        {"id": "me-3", "name": "Bill Gates", "type": "Person", "description": "Co-founder and former CEO of Microsoft", "confidenceScore": 99, "tags": ["Founder", "Philanthropist"]},
        {"id": "me-4", "name": "Azure", "type": "Product", "description": "Cloud computing platform", "confidenceScore": 99, "tags": ["Cloud", "Infrastructure"]},
        {"id": "me-5", "name": "Windows", "type": "Product", "description": "Operating system family", "confidenceScore": 99, "tags": ["OS", "Flagship"]},
        {"id": "me-6", "name": "OpenAI", "type": "Company", "description": "AI research partner and investment recipient", "confidenceScore": 99, "tags": ["Partner", "Investee"]},
        {"id": "me-7", "name": "Redmond", "type": "Location", "description": "Microsoft corporate headquarters", "confidenceScore": 98, "tags": ["HQ", "Washington"]},
        {"id": "me-8", "name": "GitHub", "type": "Company", "description": "Software development hosting subsidiary", "confidenceScore": 99, "tags": ["Subsidiary", "Git"]},
        {"id": "me-9", "name": "Microsoft Build", "type": "Event", "description": "Annual developer conference", "confidenceScore": 96, "tags": ["Conference", "Developers"]},
        {"id": "me-10", "name": "LinkedIn", "type": "Company", "description": "Professional networking subsidiary", "confidenceScore": 99, "tags": ["Subsidiary", "Social"]},
        {"id": "me-11", "name": "Copilot", "type": "Product", "description": "AI companion software integrated across products", "confidenceScore": 98, "tags": ["AI Assistant", "Product"]},
        {"id": "me-12", "name": "Steve Ballmer", "type": "Person", "description": "Former CEO of Microsoft", "confidenceScore": 99, "tags": ["Executive", "Historical"]},
        {"id": "me-13", "name": "Paul Allen", "type": "Person", "description": "Co-founder of Microsoft", "confidenceScore": 99, "tags": ["Founder", "Deceased"]},
        {"id": "me-14", "name": "Office 365", "type": "Product", "description": "Productivity cloud suite", "confidenceScore": 99, "tags": ["Enterprise", "SaaS"]},
        {"id": "me-15", "name": "Xbox", "type": "Product", "description": "Gaming brand and hardware console line", "confidenceScore": 99, "tags": ["Gaming", "Consumer"]},
        {"id": "me-16", "name": "Activision Blizzard", "type": "Company", "description": "Gaming publisher acquired in 2023", "confidenceScore": 98, "tags": ["Gaming", "Subsidiary"]},
        {"id": "me-17", "name": "Mustafa Suleyman", "type": "Person", "description": "CEO of Microsoft AI", "confidenceScore": 96, "tags": ["Executive", "AI Research"]},
        {"id": "me-18", "name": "Seattle", "type": "Location", "description": "Metropolitan area of Redmond HQ", "confidenceScore": 95, "tags": ["City", "Washington"]},
    ],
    "google": [
        {"id": "ge-1", "name": "Google", "type": "Company", "description": "Search engine and cloud compute provider", "confidenceScore": 99},
        {"id": "ge-2", "name": "Sundar Pichai", "type": "Person", "description": "CEO of Alphabet and Google", "confidenceScore": 99},
        {"id": "ge-3", "name": "Demis Hassabis", "type": "Person", "description": "CEO of Google DeepMind", "confidenceScore": 99},
        {"id": "ge-4", "name": "Gemini", "type": "Product", "description": "Multimodal foundation models", "confidenceScore": 99},
        {"id": "ge-5", "name": "Google Cloud", "type": "Product", "description": "Enterprise cloud hosting platform", "confidenceScore": 99},
        {"id": "ge-6", "name": "Mountain View", "type": "Location", "description": "Google headquarters (Googleplex)", "confidenceScore": 99},
        {"id": "ge-7", "name": "London", "type": "Location", "description": "DeepMind main office location", "confidenceScore": 98},
        {"id": "ge-8", "name": "Google I/O", "type": "Event", "description": "Annual developer conference", "confidenceScore": 95},
    ],
    "default": [
        {"id": "de-1", "name": "Target Entity", "type": "Company", "description": "Entity under active investigation", "confidenceScore": 80},
        {"id": "de-2", "name": "Executive Director", "type": "Person", "description": "Key executive officer", "confidenceScore": 78},
        {"id": "de-3", "name": "Main Product", "type": "Product", "description": "Core product line of target", "confidenceScore": 85},
        {"id": "de-4", "name": "Parent Group", "type": "Organization", "description": "Holding company or parent group", "confidenceScore": 82},
        {"id": "de-5", "name": "Registered Office", "type": "Location", "description": "Official corporate registry location", "confidenceScore": 90},
        {"id": "de-6", "name": "Annual Summit", "type": "Event", "description": "Corporate stakeholder event", "confidenceScore": 70},
    ],
}

# ── Relationships ─────────────────────────────────────────────────────────────

MOCK_RELATIONSHIPS: dict[str, list[dict]] = {
    "openai": [
        {"id": "or-1", "source": "OpenAI", "sourceType": "Company", "relationship": "Partnered with", "target": "Microsoft", "targetType": "Company", "confidenceScore": 99},
        {"id": "or-2", "source": "Sam Altman", "sourceType": "Person", "relationship": "CEO of", "target": "OpenAI", "targetType": "Company", "confidenceScore": 99},
        {"id": "or-3", "source": "Greg Brockman", "sourceType": "Person", "relationship": "President of", "target": "OpenAI", "targetType": "Company", "confidenceScore": 98},
        {"id": "or-4", "source": "Ilya Sutskever", "sourceType": "Person", "relationship": "Co-founder & Chief Scientist", "target": "OpenAI", "targetType": "Company", "confidenceScore": 99},
        {"id": "or-5", "source": "OpenAI", "sourceType": "Company", "relationship": "Developed", "target": "ChatGPT", "targetType": "Product", "confidenceScore": 99},
        {"id": "or-6", "source": "OpenAI", "sourceType": "Company", "relationship": "Developed", "target": "GPT-4", "targetType": "Product", "confidenceScore": 99},
        {"id": "or-7", "source": "OpenAI", "sourceType": "Company", "relationship": "Headquartered in", "target": "San Francisco", "targetType": "Location", "confidenceScore": 99},
        {"id": "or-8", "source": "OpenAI", "sourceType": "Company", "relationship": "Organized", "target": "OpenAI DevDay", "targetType": "Event", "confidenceScore": 95},
        {"id": "or-9", "source": "Sam Altman", "sourceType": "Person", "relationship": "Incubated by", "target": "Y Combinator", "targetType": "Organization", "confidenceScore": 92},
        {"id": "or-10", "source": "Mira Murati", "sourceType": "Person", "relationship": "CTO of", "target": "OpenAI", "targetType": "Company", "confidenceScore": 97},
        {"id": "or-11", "source": "OpenAI", "sourceType": "Company", "relationship": "Developed", "target": "Sora", "targetType": "Product", "confidenceScore": 96},
        {"id": "or-12", "source": "OpenAI", "sourceType": "Company", "relationship": "Developed", "target": "DALL-E", "targetType": "Product", "confidenceScore": 98},
        {"id": "or-13", "source": "Ilya Sutskever", "sourceType": "Person", "relationship": "Founded", "target": "Safe Superintelligence Inc. (SSI)", "targetType": "Company", "confidenceScore": 98},
    ],
    "microsoft": [
        {"id": "mr-1", "source": "Microsoft", "sourceType": "Company", "relationship": "Invested in", "target": "OpenAI", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-2", "source": "Satya Nadella", "sourceType": "Person", "relationship": "CEO of", "target": "Microsoft", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-3", "source": "Bill Gates", "sourceType": "Person", "relationship": "Co-founder of", "target": "Microsoft", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-4", "source": "Microsoft", "sourceType": "Company", "relationship": "Developed", "target": "Azure", "targetType": "Product", "confidenceScore": 99},
        {"id": "mr-5", "source": "Microsoft", "sourceType": "Company", "relationship": "Developed", "target": "Windows", "targetType": "Product", "confidenceScore": 99},
        {"id": "mr-6", "source": "Microsoft", "sourceType": "Company", "relationship": "Acquired", "target": "GitHub", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-7", "source": "Microsoft", "sourceType": "Company", "relationship": "Headquartered in", "target": "Redmond", "targetType": "Location", "confidenceScore": 98},
        {"id": "mr-8", "source": "Microsoft", "sourceType": "Company", "relationship": "Organized", "target": "Microsoft Build", "targetType": "Event", "confidenceScore": 96},
        {"id": "mr-9", "source": "Microsoft", "sourceType": "Company", "relationship": "Acquired", "target": "LinkedIn", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-10", "source": "Microsoft", "sourceType": "Company", "relationship": "Developed", "target": "Copilot", "targetType": "Product", "confidenceScore": 98},
        {"id": "mr-11", "source": "Steve Ballmer", "sourceType": "Person", "relationship": "Former CEO of", "target": "Microsoft", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-12", "source": "Paul Allen", "sourceType": "Person", "relationship": "Co-founder of", "target": "Microsoft", "targetType": "Company", "confidenceScore": 99},
        {"id": "mr-13", "source": "Microsoft", "sourceType": "Company", "relationship": "Developed", "target": "Office 365", "targetType": "Product", "confidenceScore": 99},
        {"id": "mr-14", "source": "Microsoft", "sourceType": "Company", "relationship": "Developed", "target": "Xbox", "targetType": "Product", "confidenceScore": 99},
        {"id": "mr-15", "source": "Microsoft", "sourceType": "Company", "relationship": "Acquired", "target": "Activision Blizzard", "targetType": "Company", "confidenceScore": 98},
        {"id": "mr-16", "source": "Mustafa Suleyman", "sourceType": "Person", "relationship": "CEO of AI at", "target": "Microsoft", "targetType": "Company", "confidenceScore": 96},
        {"id": "mr-17", "source": "Redmond", "sourceType": "Location", "relationship": "Sub-district of", "target": "Seattle", "targetType": "Location", "confidenceScore": 95},
    ],
    "google": [
        {"id": "gr-1", "source": "Google", "sourceType": "Company", "relationship": "Acquired & Merged", "target": "Google DeepMind", "targetType": "Company", "confidenceScore": 99},
        {"id": "gr-2", "source": "Sundar Pichai", "sourceType": "Person", "relationship": "CEO of", "target": "Google", "targetType": "Company", "confidenceScore": 99},
        {"id": "gr-3", "source": "Demis Hassabis", "sourceType": "Person", "relationship": "CEO of", "target": "Google DeepMind", "targetType": "Company", "confidenceScore": 99},
        {"id": "gr-4", "source": "Google", "sourceType": "Company", "relationship": "Developed", "target": "Gemini", "targetType": "Product", "confidenceScore": 99},
        {"id": "gr-5", "source": "Google", "sourceType": "Company", "relationship": "Developed", "target": "Google Cloud", "targetType": "Product", "confidenceScore": 99},
        {"id": "gr-6", "source": "Google", "sourceType": "Company", "relationship": "Headquartered in", "target": "Mountain View", "targetType": "Location", "confidenceScore": 99},
        {"id": "gr-7", "source": "Google DeepMind", "sourceType": "Company", "relationship": "Based in", "target": "London", "targetType": "Location", "confidenceScore": 98},
        {"id": "gr-8", "source": "Google", "sourceType": "Company", "relationship": "Organized", "target": "Google I/O", "targetType": "Event", "confidenceScore": 95},
    ],
    "default": [
        {"id": "dr-1", "source": "Target Entity", "sourceType": "Company", "relationship": "Managed by", "target": "Executive Director", "targetType": "Person", "confidenceScore": 78},
        {"id": "dr-2", "source": "Target Entity", "sourceType": "Company", "relationship": "Offers", "target": "Main Product", "targetType": "Product", "confidenceScore": 85},
        {"id": "dr-3", "source": "Target Entity", "sourceType": "Company", "relationship": "Subsidiary of", "target": "Parent Group", "targetType": "Organization", "confidenceScore": 82},
        {"id": "dr-4", "source": "Target Entity", "sourceType": "Company", "relationship": "Registered at", "target": "Registered Office", "targetType": "Location", "confidenceScore": 90},
        {"id": "dr-5", "source": "Target Entity", "sourceType": "Company", "relationship": "Hosts", "target": "Annual Summit", "targetType": "Event", "confidenceScore": 70},
    ],
}

