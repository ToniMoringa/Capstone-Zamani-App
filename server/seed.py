from datetime import date
from config import db
from models import Capsule, Tag

# Using YouTube for video content and Pexels/Images for static visuals
KENYAN_BIRTHS = [
    {
        "date": date(1987, 6, 15),
        "title": "Bien-Aimé Baraza (Bien)",
        "description": "Lead vocalist of Sauti Sol; Grammy-nominated Afro-pop artist.",
        "category": "birth",
        "image_url": "https://rwandahd.com/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-30-at-10.30.54.jpeg",
        "tags": ["music", "sauti sol"]
    },
    {
        "date": date(1984, 11, 5),
        "title": "Eliud Kipchoge",
        "description": "Marathon world record holder; first human to run sub-2-hour marathon.",
        "category": "birth",
        "image_url": "https://athleticsillustrated.com/wp-content/uploads/2023/09/Kipchoge_Eluid1a-Berlin22.jpg",
        "tags": ["sports", "athletics"]
    },
    {
        "date": date(1994, 1, 10),
        "title": "Faith Kipyegon",
        "description": "Olympic gold medalist; 1500m world record holder.",
        "category": "birth",
        "image_url": "https://hips.hearstapps.com/hmg-prod/images/paris-france-10-august-2024-faith-kipyegon-of-team-c2-a0kenya-news-photo-1723315497.jpg?crop=0.692xw:1.00xh;0.250xw,0&resize=640:*",
        "tags": ["sports", "athletics"]
    }
]

HISTORICAL_EVENTS = [
    {
        "date": date(1963, 12, 12),
        "title": "Kenya Independence Day",
        "description": "Kenya gains full independence from British colonial rule.",
        "category": "event",
        "image_url": "https://youtu.be/NscUIwDqxjk",
        "tags": ["politics", "independence"]
    },
    {
        "date": date(2024, 6, 25),
        "title": "Gen Z Protests Peak",
        "description": "Nationwide youth-led demonstrations against Finance Bill reach historic scale.",
        "category": "event",
        "image_url": "https://ichef.bbci.co.uk/news/480/cpsprodpb/d72d/live/164f20b0-2e5f-11ef-90be-b75b34b0bbb2.jpg.webp",
        "tags": ["politics", "youth"]
    },
    {
        "date": date(1963, 6, 1),
        "title": "Madaraka Day",
        "description": "Kenya achieved internal self-government, transitioning from colonial rule.",
        "category": "event",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrvoFmtgFoxrlMd7apzfAowiIVaSQYN2iY-s8TyRXgFvWiCGXFKJi0PBQ&s=10",
        "tags": ["politics", "independence"]
    },
    {
        "date": date(2010, 8, 27),
        "title": "New Constitution Promulgated",
        "description": "Kenya's new constitution was promulgated, introducing devolution and bill of rights.",
        "category": "event",
        "image_url": "https://youtu.be/MdNI6atsqVQ",
        "tags": ["politics", "constitution"]
    },
    {
        "date": date(1988, 9, 25),
        "title": "Douglas Wakiihuri Olympic Gold",
        "description": "Won Kenya's first Olympic marathon gold medal in Seoul.",
        "category": "birth",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfzOEsSyGTtZSejZ1SGclHujdLSiNr3dLNCIIOKXyP6zwoXEGMuTdotViI&s=10",
        "tags": ["sports", "athletics"]
    },
    {
        "date": date(1998, 8, 7),
        "title": "US Embassy Bombing",
        "description": "Al-Qaeda bombed the US Embassy in Nairobi, killing 213 people.",
        "category": "event",
        "image_url": "https://images.pexels.com/photos/39108183/pexels-photo-39108183/free-photo-of-serene-swan-reflecting-in-golden-afternoon-light.jpeg?auto=compress&w=600",
        "tags": ["security", "history"]
    },
    {
        "date": date(2017, 10, 16),
        "title": "SGR Launch",
        "description": "The Standard Gauge Railway between Mombasa and Nairobi officially launched.",
        "category": "event",
        "image_url": "https://youtu.be/9iyA50VmJ10",
        "tags": ["infrastructure", "development"]
    }
]

def seed_database():
    """Populate DB with verified Kenyan data, updating existing records."""
    print("𓇢 Seeding ZAMANI database...")

    # Create tags first
    entries = KENYAN_BIRTHS + HISTORICAL_EVENTS
    tag_names = set()
    
    for entry in entries:
        tag_names.update(entry.get('tags', []))

    tags_map = {}
    for name in tag_names:
        tag = Tag.query.filter_by(name=name).first()
        if not tag:
            tag = Tag(name=name)
            db.session.add(tag)
        tags_map[name] = tag
    
    db.session.flush() # Ensure tags have IDs before linking

    # Seed births and events
    for entry in entries:
        capsule = Capsule.query.filter_by(
            date=entry['date'], 
            title=entry['title']
        ).first()

        if not capsule:
            capsule = Capsule(
                date=entry['date'],
                title=entry['title'],
                description=entry['description'],
                category=entry['category'],
                image_url=entry['image_url'],
                historical_content=True
            )
            db.session.add(capsule)
        else:
            # Update existing record with new media/description
            capsule.description = entry['description']
            capsule.image_url = entry['image_url']
            capsule.category = entry['category']
            capsule.historical_content = True

        # Sync tags
        capsule.tags = [tags_map[tag_name] for tag_name in entry.get('tags', [])]

    db.session.commit()
    print(f"✔ Seeded {len(KENYAN_BIRTHS)} births and {len(HISTORICAL_EVENTS)} events")

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_database()