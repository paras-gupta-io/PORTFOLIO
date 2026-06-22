from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# -----------------------------------------------------------------------------
# Setup
# -----------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALG = "HS256"
JWT_EXP_HOURS = 24

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
RESUME_URL = os.environ.get("RESUME_URL", "")

app = FastAPI()
api_router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def hash_password(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(pwd: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pwd.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)) -> dict:
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return payload

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str

class Profile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    title: str
    tagline: str
    bio: str
    location: str
    email: str
    phone: str
    whatsapp: str
    github: str
    linkedin: str
    resume_url: str
    avatar_url: str
    hero_image_url: str
    about_heading: str = "Reading\ndatasets\nlike race\ntelemetry."
    about_subhead: str = "For the gaps, the trends, and the story underneath the rows."

class Skill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    name: str
    order: int = 0

class SkillCreate(BaseModel):
    category: str
    name: str
    order: int = 0

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    tech_stack: List[str] = []
    image_url: str = ""
    github_url: str = ""
    live_url: str = ""
    featured: bool = False
    order: int = 0

class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str] = []
    image_url: str = ""
    github_url: str = ""
    live_url: str = ""
    featured: bool = False
    order: int = 0

class Experience(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str
    company: str
    location: str
    duration: str
    description: str
    order: int = 0

class ExperienceCreate(BaseModel):
    role: str
    company: str
    location: str
    duration: str
    description: str
    order: int = 0

class Education(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    degree: str
    institution: str
    location: str
    duration: str
    grade: str = ""
    order: int = 0

class EducationCreate(BaseModel):
    degree: str
    institution: str
    location: str
    duration: str
    grade: str = ""
    order: int = 0

class Certification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    issuer: str
    date: str
    order: int = 0

class CertificationCreate(BaseModel):
    title: str
    issuer: str
    date: str
    order: int = 0

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str = ""
    body: str
    created_at: str = Field(default_factory=now_iso)
    read: bool = False

class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str = ""
    body: str

# -----------------------------------------------------------------------------
# Seed data
# -----------------------------------------------------------------------------
DEFAULT_PROFILE = {
    "name": "Paras Gupta",
    "title": "Aspiring Data Analyst",
    "tagline": "Translating raw datasets into broadcast-ready insights.",
    "bio": "Detail-oriented final-year B.Tech CS student (CGPA 8.0/10) seeking a Data Analyst internship. I work end-to-end with data — EDA, SQL, and interactive Power BI dashboards — and have hands-on experience with AWS cloud infrastructure. Strong communicator who turns messy datasets into clear, actionable stories for non-technical stakeholders.",
    "location": "Jaipur, Rajasthan",
    "email": "parasguptasnl@gmail.com",
    "phone": "+919783750052",
    "whatsapp": "+919783750052",
    "github": "https://github.com/guptaji0102",
    "linkedin": "https://linkedin.com/in/paras-gupta-dev",
    "resume_url": RESUME_URL,
    "avatar_url": "/paras.png",
    "hero_image_url": "https://images.pexels.com/photos/10325707/pexels-photo-10325707.png",
    "about_heading": "Reading\ndatasets\nlike race\ntelemetry.",
    "about_subhead": "For the gaps, the trends, and the story underneath the rows.",
}

DEFAULT_SKILLS = [
    ("Data & Analytics", ["Python", "SQL", "Power BI", "Tableau", "Excel", "EDA", "Data Cleaning", "Data Modeling", "KPI Reporting", "Statistical Analysis"]),
    ("Cloud & Tools", ["AWS Services", "GitHub", "Jupyter Notebook", "VS Code", "Agile", "Dashboard Design"]),
    ("Programming", ["Python", "SQL", "C"]),
    ("Soft Skills", ["Communication", "Problem Solving", "Analytical Thinking", "Requirements Gathering", "Critical Thinking"]),
]

DEFAULT_PROJECTS = [
    {
        "title": "F1 Pit Wall Productivity Dashboard",
        "description": "A real-time race-control dashboard inspired by Formula 1 pit walls. Multi-panel UI with tire compound tracker (Soft/Medium/Hard), gap-time leaderboard, pit history, weather, team radio logs, and WDC standings — 6+ concurrent data streams composed into a single broadcast-grade layout.",
        "tech_stack": ["HTML", "CSS", "Dashboard Design", "Data Visualization"],
        "image_url": "https://images.pexels.com/photos/29309761/pexels-photo-29309761.jpeg",
        "github_url": "https://github.com/guptaji0102",
        "live_url": "",
        "featured": True,
        "order": 0,
    }
]

DEFAULT_EXPERIENCE = [
    {
        "role": "AWS Solutions Architect Associate Intern",
        "company": "Grass Solutions",
        "location": "Jaipur, Rajasthan",
        "duration": "May 2026 – July 2026",
        "description": "Architecting scalable AWS infrastructure (EC2, S3, RDS, IAM, VPC, Lambda) across 3+ production environments using the Well-Architected Framework. Cut storage costs by 15% via S3 lifecycle policies; built 5+ Python Lambda functions reducing manual work ~40%. Enforced least-privilege IAM with zero security incidents.",
        "order": 0,
    }
]

DEFAULT_EDUCATION = [
    {
        "degree": "B.Tech, Computer Science & Engineering",
        "institution": "Arya College of Engineering",
        "location": "Jaipur, Rajasthan",
        "duration": "2023 – 2027 (Expected)",
        "grade": "CGPA 8.0 / 10",
        "order": 0,
    }
]

DEFAULT_CERTIFICATIONS = [
    {"title": "Deloitte Data Analytics Job Simulation", "issuer": "Forage", "date": "June 2026", "order": 0},
    {"title": "Tata GenAI Powered Data Analytics", "issuer": "Forage", "date": "June 2026", "order": 1},
    {"title": "C, C++, Java, PostgreSQL", "issuer": "Spoken Tutorial, IIT Bombay", "date": "—", "order": 2},
]

async def seed_data():
    # Admin
    existing_admin = await db.admins.find_one({"email": ADMIN_EMAIL})
    if existing_admin is None:
        await db.admins.insert_one({
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info(f"Seeded admin: {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing_admin["password_hash"]):
        await db.admins.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info(f"Updated admin password: {ADMIN_EMAIL}")

    # Profile
    if await db.profile.count_documents({}) == 0:
        await db.profile.insert_one(DEFAULT_PROFILE)
    else:
        # Migrate: add missing fields without overwriting user edits
        existing = await db.profile.find_one({}) or {}
        missing = {k: v for k, v in DEFAULT_PROFILE.items() if k not in existing}
        if missing:
            await db.profile.update_one({}, {"$set": missing})

    # Skills
    if await db.skills.count_documents({}) == 0:
        docs = []
        order = 0
        for cat, names in DEFAULT_SKILLS:
            for n in names:
                docs.append(Skill(category=cat, name=n, order=order).model_dump())
                order += 1
        if docs:
            await db.skills.insert_many(docs)

    # Projects
    if await db.projects.count_documents({}) == 0:
        for p in DEFAULT_PROJECTS:
            await db.projects.insert_one(Project(**p).model_dump())

    # Experience
    if await db.experiences.count_documents({}) == 0:
        for e in DEFAULT_EXPERIENCE:
            await db.experiences.insert_one(Experience(**e).model_dump())

    # Education
    if await db.education.count_documents({}) == 0:
        for ed in DEFAULT_EDUCATION:
            await db.education.insert_one(Education(**ed).model_dump())

    # Certifications
    if await db.certifications.count_documents({}) == 0:
        for c in DEFAULT_CERTIFICATIONS:
            await db.certifications.insert_one(Certification(**c).model_dump())


# -----------------------------------------------------------------------------
# Public Routes
# -----------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Portfolio API alive"}

@api_router.get("/profile")
async def get_profile():
    doc = await db.profile.find_one({}, {"_id": 0})
    return doc or DEFAULT_PROFILE

@api_router.get("/skills")
async def list_skills():
    return await db.skills.find({}, {"_id": 0}).sort("order", 1).to_list(1000)

@api_router.get("/projects")
async def list_projects():
    return await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(1000)

@api_router.get("/experiences")
async def list_experiences():
    return await db.experiences.find({}, {"_id": 0}).sort("order", 1).to_list(1000)

@api_router.get("/education")
async def list_education():
    return await db.education.find({}, {"_id": 0}).sort("order", 1).to_list(1000)

@api_router.get("/certifications")
async def list_certifications():
    return await db.certifications.find({}, {"_id": 0}).sort("order", 1).to_list(1000)

@api_router.post("/messages", response_model=Message)
async def create_message(payload: MessageCreate):
    m = Message(**payload.model_dump())
    await db.messages.insert_one(m.model_dump())
    return m

# -----------------------------------------------------------------------------
# Auth Routes
# -----------------------------------------------------------------------------
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower()
    user = await db.admins.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(email)
    return TokenResponse(access_token=token, email=email)

@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return {"email": admin["sub"], "role": admin["role"]}

# -----------------------------------------------------------------------------
# Admin (protected) Routes
# -----------------------------------------------------------------------------
@api_router.put("/profile")
async def update_profile(payload: Profile, admin=Depends(get_current_admin)):
    data = payload.model_dump()
    await db.profile.update_one({}, {"$set": data}, upsert=True)
    return data

# Skills
@api_router.post("/skills", response_model=Skill)
async def create_skill(payload: SkillCreate, admin=Depends(get_current_admin)):
    s = Skill(**payload.model_dump())
    await db.skills.insert_one(s.model_dump())
    return s

@api_router.put("/skills/{skill_id}", response_model=Skill)
async def update_skill(skill_id: str, payload: SkillCreate, admin=Depends(get_current_admin)):
    res = await db.skills.update_one({"id": skill_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Skill not found")
    doc = await db.skills.find_one({"id": skill_id}, {"_id": 0})
    return doc

@api_router.delete("/skills/{skill_id}")
async def delete_skill(skill_id: str, admin=Depends(get_current_admin)):
    res = await db.skills.delete_one({"id": skill_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Skill not found")
    return {"ok": True}

# Projects
@api_router.post("/projects", response_model=Project)
async def create_project(payload: ProjectCreate, admin=Depends(get_current_admin)):
    p = Project(**payload.model_dump())
    await db.projects.insert_one(p.model_dump())
    return p

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, payload: ProjectCreate, admin=Depends(get_current_admin)):
    res = await db.projects.update_one({"id": project_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Project not found")
    doc = await db.projects.find_one({"id": project_id}, {"_id": 0})
    return doc

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, admin=Depends(get_current_admin)):
    res = await db.projects.delete_one({"id": project_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Project not found")
    return {"ok": True}

# Experiences
@api_router.post("/experiences", response_model=Experience)
async def create_experience(payload: ExperienceCreate, admin=Depends(get_current_admin)):
    e = Experience(**payload.model_dump())
    await db.experiences.insert_one(e.model_dump())
    return e

@api_router.put("/experiences/{exp_id}", response_model=Experience)
async def update_experience(exp_id: str, payload: ExperienceCreate, admin=Depends(get_current_admin)):
    res = await db.experiences.update_one({"id": exp_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Experience not found")
    return await db.experiences.find_one({"id": exp_id}, {"_id": 0})

@api_router.delete("/experiences/{exp_id}")
async def delete_experience(exp_id: str, admin=Depends(get_current_admin)):
    res = await db.experiences.delete_one({"id": exp_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Experience not found")
    return {"ok": True}

# Education
@api_router.post("/education", response_model=Education)
async def create_education(payload: EducationCreate, admin=Depends(get_current_admin)):
    e = Education(**payload.model_dump())
    await db.education.insert_one(e.model_dump())
    return e

@api_router.put("/education/{ed_id}", response_model=Education)
async def update_education(ed_id: str, payload: EducationCreate, admin=Depends(get_current_admin)):
    res = await db.education.update_one({"id": ed_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Education not found")
    return await db.education.find_one({"id": ed_id}, {"_id": 0})

@api_router.delete("/education/{ed_id}")
async def delete_education(ed_id: str, admin=Depends(get_current_admin)):
    res = await db.education.delete_one({"id": ed_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Education not found")
    return {"ok": True}

# Certifications
@api_router.post("/certifications", response_model=Certification)
async def create_cert(payload: CertificationCreate, admin=Depends(get_current_admin)):
    c = Certification(**payload.model_dump())
    await db.certifications.insert_one(c.model_dump())
    return c

@api_router.put("/certifications/{cert_id}", response_model=Certification)
async def update_cert(cert_id: str, payload: CertificationCreate, admin=Depends(get_current_admin)):
    res = await db.certifications.update_one({"id": cert_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Certification not found")
    return await db.certifications.find_one({"id": cert_id}, {"_id": 0})

@api_router.delete("/certifications/{cert_id}")
async def delete_cert(cert_id: str, admin=Depends(get_current_admin)):
    res = await db.certifications.delete_one({"id": cert_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Certification not found")
    return {"ok": True}

# Messages
@api_router.get("/messages")
async def list_messages(admin=Depends(get_current_admin)):
    return await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api_router.put("/messages/{msg_id}/read")
async def mark_read(msg_id: str, admin=Depends(get_current_admin)):
    res = await db.messages.update_one({"id": msg_id}, {"$set": {"read": True}})
    if res.matched_count == 0:
        raise HTTPException(404, "Message not found")
    return {"ok": True}

@api_router.delete("/messages/{msg_id}")
async def delete_message(msg_id: str, admin=Depends(get_current_admin)):
    res = await db.messages.delete_one({"id": msg_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Message not found")
    return {"ok": True}

# -----------------------------------------------------------------------------
# App wiring
# -----------------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await seed_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
