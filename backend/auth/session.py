from uuid import uuid4

# In-memory session store
# Later this can be moved to MongoDB if needed.
active_sessions = {}


def create_session():
    session_id = str(uuid4())
    active_sessions[session_id] = True
    return session_id


def is_logged_in(session_id: str):
    return active_sessions.get(session_id, False)


def logout(session_id: str):
    active_sessions.pop(session_id, None)