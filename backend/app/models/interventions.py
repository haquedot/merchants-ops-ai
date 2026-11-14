from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.outcome import Outcome
    from app.models.recovery_events import RecoveryEvent


class Intervention(Base):
    __tablename__ = "interventions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    recovery_event_id: Mapped[int] = mapped_column(
        ForeignKey(
            "recovery_events.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    action_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    cost_paise: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    agent_reason: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    executed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # --- Paytm Test Mode correlation (nullable; only set when the
    #     Payment Link execution path runs for this intervention) --------
    paytm_reference_id: Mapped[str | None] = mapped_column(
        String(120),
        unique=True,
        nullable=True,
    )

    paytm_payment_link_id: Mapped[str | None] = mapped_column(
        String(64),
        unique=True,
        nullable=True,
        index=True,
    )

    paytm_short_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    paytm_payment_id: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
    )

    last_paytm_status: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    recovery_event: Mapped["RecoveryEvent"] = relationship(
        back_populates="interventions",
    )

    outcome: Mapped["Outcome | None"] = relationship(
        back_populates="intervention",
        uselist=False,
        cascade="all, delete-orphan",
    )