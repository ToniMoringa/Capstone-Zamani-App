from datetime import date
from .config import db
from .models import Capsule, Tag

KENYAN_BIRTHS = [
    {
        "date": date(1987, 6, 15),
        "title": "Bien-Aimé Baraza (Bien)",
        "description": "Lead vocalist of Sauti Sol; Grammy-nominated Afro-pop artist.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Bien_Aime_Baraza.jpg/440px-Bien_Aime_Baraza.jpg",
        "tags": ["music", "sauti sol"]
    },
    {
        "date": date(1984, 11, 5),
        "title": "Eliud Kipchoge",
        "description": "Marathon world record holder; first human to run sub-2-hour marathon.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Eliud_Kipchoge_2019.jpg/440px-Eliud_Kipchoge_2019.jpg",
        "tags": ["sports", "athletics"]
    },
    {
        "date": date(1994, 1, 10),
        "title": "Faith Kipyegon",
        "description": "Olympic gold medalist; 1500m world record holder.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Faith_Kipyegon_2022.jpg/440px-Faith_Kipyegon_2022.jpg",
        "tags": ["sports", "athletics"]
    }
]

HISTORICAL_EVENTS = [
    {
        "date": date(1963, 12, 12),
        "title": "Kenya Independence Day",
        "description": "Kenya gains full independence from British colonial rule.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kenya_Flag_Raising_1963.jpg/440px-Kenya_Flag_Raising_1963.jpg",
        "tags": ["politics", "independence"]
    },
    
    {
        "date": date(2024, 6, 25),
        "title": "Gen Z Protests Peak",
        "description": "Nationwide youth-led demonstrations against Finance Bill reach historic scale.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gen_Z_Protest_Nairobi_2024.jpg/440px-Gen_Z_Protest_Nairobi_2024.jpg",
        "tags": ["politics", "youth"]
    },
    {
        "date": date(1963, 6, 1),
        "title": "Madaraka Day",
        "description": "Kenya achieved internal self-government, transitioning from colonial rule.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kenya_Flag_Raising_1963.jpg/440px-Kenya_Flag_Raising_1963.jpg",
        "tags": ["politics", "independence"]
    },
    {
        "date": date(2010, 8, 27),
        "title": "New Constitution Promulgated",
        "description": "Kenya's new constitution was promulgated, introducing devolution and bill of rights.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kenya_Flag_Raising_1963.jpg/440px-Kenya_Flag_Raising_1963.jpg",
        "tags": ["politics", "constitution"]
    },
    {
        "date": date(1988, 9, 25),
        "title": "Douglas Wakiihuri Olympic Gold",
        "description": "Won Kenya's first Olympic marathon gold medal in Seoul.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Eliud_Kipchoge_2019.jpg/440px-Eliud_Kipchoge_2019.jpg",
        "tags": ["sports", "athletics"]
    },
    {
        "date": date(1998, 8, 7),
        "title": "US Embassy Bombing",
        "description": "Al-Qaeda bombed the US Embassy in Nairobi, killing 213 people.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gen_Z_Protest_Nairobi_2024.jpg/440px-Gen_Z_Protest_Nairobi_2024.jpg",
        "tags": ["security", "history"]
    },
    {
        "date": date(2017, 10, 16),
        "title": "SGR Launch",
        "description": "The Standard Gauge Railway between Mombasa and Nairobi officially launched.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gen_Z_Protest_Nairobi_2024.jpg/440px-Gen_Z_Protest_Nairobi_2024.jpg",
        "tags": ["infrastructure", "development"]
    }
]

def seed_database():
    """Populate DB with verified Kenyan data"""
    print("𓇢 Seeding ZAMANI database...")
    
    # Create tags first
    tag_names = set()
    for entry in KENYAN_BIRTHS + HISTORICAL_EVENTS:
        tag_names.update(entry.get('tags', []))
    
    tags_map = {}
    for name in tag_names:
        tag = Tag.query.filter_by(name=name).first()
        if not tag:
            tag = Tag(name=name)
            db.session.add(tag)
        tags_map[name] = tag
    
    db.session.commit()
    
    # Seed births
    for birth in KENYAN_BIRTHS:
        existing = Capsule.query.filter_by(date=birth['date'], title=birth['title']).first()
        if not existing:
            capsule = Capsule(
                date=birth['date'],
                title=birth['title'],
                description=birth['description'],
                category=birth['category'],
                image_url=birth['image_url'],
                historical_content=True
            )
            for tag_name in birth.get('tags', []):
                capsule.tags.append(tags_map[tag_name])
            db.session.add(capsule)
    
    # Seed events
    for event in HISTORICAL_EVENTS:
        existing = Capsule.query.filter_by(date=event['date'], title=event['title']).first()
        if not existing:
            capsule = Capsule(
                date=event['date'],
                title=event['title'],
                description=event['description'],
                category=event['category'],
                image_url=event['image_url'],
                historical_content=True
            )
            for tag_name in event.get('tags', []):
                capsule.tags.append(tags_map[tag_name])
            db.session.add(capsule)
    
    db.session.commit()
    print(f"✔ Seeded {len(KENYAN_BIRTHS)} births and {len(HISTORICAL_EVENTS)} events")

if __name__ == '__main__':
    from .app import create_app
    app = create_app()
    with app.app_context():
        seed_database()