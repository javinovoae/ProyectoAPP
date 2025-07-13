
from sqlalchemy.orm import Session
from backend import models, schemas

# Función para obtener un usuario por su nombre de usuario
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# Obtener un usuario por ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

#crear usuario
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        hashed_password=user.password, 
        name=user.name if user.name else None,
        lastname=user.lastname if user.lastname else None,
        education=user.education if user.education else None,
        birthdate=user.birthdate if user.birthdate else None,
        is_active=True 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#actualiozar usuario
def update_user(db: Session, db_user: models.User, user_data: schemas.UserProfileUpdate):
    for field, value in user_data.model_dump(exclude_unset=True).items():
        if hasattr(db_user, field): 
            setattr(db_user, field, value) 

    db.add(db_user)
    db.commit()
    db.refresh(db_user) 
    return db_user

#crear evento
def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(
        name=event.name,
        event_date=event.event_date,
        manager_id=event.manager_id  
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

#buscar evento segun nombre,fecha e id del usuario 
def get_events_by_criteria(db: Session, name: str, event_date: str, manager_id: int):
    return db.query(models.Event).filter(
        models.Event.name == name,
        models.Event.event_date == event_date, 
        models.Event.manager_id == manager_id
    ).all() 


# Función para crear el ticket y calcular su precio total
def create_ticket(db: Session, ticket_data: schemas.TicketCreate):
    total_ticket_price = 0.0

    # Calcular el precio total de los productos del ticket
    if not ticket_data.ticket_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ticket debe tener al menos 1 producto."
        )

    for item_data in ticket_data.ticket_items:

        product_price = get_product_base_price(db, item_data.product_id)
        total_ticket_price += (item_data.cantidad_prod_ticket * product_price)

    db_ticket = models.Ticket(
        price_ticket=total_ticket_price, 
        buyer_id=ticket_data.buyer_id,
        event_id=ticket_data.event_id,
        
    )
    db.add(db_ticket)
    db.commit() 
    db.refresh(db_ticket)

    for item_data in ticket_data.ticket_items:
        db_cantidad_ticket = models.CantidadTicket(
            ticket_id=db_ticket.id, 
            product_id=item_data.product_id,
            cantidad_prod_ticket=item_data.cantidad_prod_ticket
        )
        db.add(db_cantidad_ticket)
    
    db.commit()
    db.refresh(db_ticket) 


    # --- Actualizar la ganancia total del evento ---
    event = db.query(models.Event).filter(models.Event.id == db_ticket.event_id).first()
    if event:
        # Sumamos el total
        event.total_earnings += db_ticket.price_ticket
        db.add(event)
        db.commit()
        db.refresh(event)

    return db_ticket

#recupera un evento por el nombre
def get_event_by_name(db: Session, name: str):
    return db.query(models.Event).filter(models.Event.name == name).first()

#funciones producto 


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_name(db: Session, name: str):
    return db.query(models.Product).filter(models.Product.name == name).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate, user_id: int): 
    db_product = models.Product(
        name=product.name,
        price=product.price,
        is_available=product.is_available,
        user_id=user_id 
    )
    db.add(db_product)
    try:
        db.commit()
        db.refresh(db_product)
        return db_product
    except IntegrityError:
        db.rollback()
        raise ValueError("Un producto con este nombre ya existe.")

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

def get_products_by_user(db: Session, user_id: int):
    return db.query(models.Product).filter(models.Product.user_id == user_id).all()

