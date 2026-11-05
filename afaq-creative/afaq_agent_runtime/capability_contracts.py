"""Capability domain contracts (governance hardening).

Frozen dataclasses and enums describing a governed capability record:
classification, maturity ladder, origin, evidence/report references, and
trust score. Validation lives in ``__post_init__`` so every record is
well-formed at construction time.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Mapping


class CapabilityClass(str, Enum):
    CORE = "CORE"
    PLATFORM = "PLATFORM"
    DOMAIN_PACK = "DOMAIN_PACK"
    OPTIONAL = "OPTIONAL"


class CapabilityMaturity(str, Enum):
    NOT_DESIGNED = "NOT_DESIGNED"
    DESIGNED = "DESIGNED"
    IMPLEMENTED = "IMPLEMENTED"
    TESTED = "TESTED"
    VALIDATED = "VALIDATED"
    PRODUCTION_READY = "PRODUCTION_READY"


class CapabilityOrigin(str, Enum):
    MANUAL = "MANUAL"
    ASSISTED = "ASSISTED"
    AUTOMATED = "AUTOMATED"
    AUTONOMOUS_PROPOSAL = "AUTONOMOUS_PROPOSAL"
    AUTONOMOUS_SANDBOX = "AUTONOMOUS_SANDBOX"


@dataclass(frozen=True, slots=True)
class CapabilityRecord:
    capability_id: str
    name: str
    classification: CapabilityClass
    maturity: CapabilityMaturity
    origin: CapabilityOrigin

    description: str = ""

    parent_ids: tuple[str, ...] = ()
    dependency_ids: tuple[str, ...] = ()
    child_ids: tuple[str, ...] = ()

    evidence_refs: tuple[str, ...] = ()
    report_refs: tuple[str, ...] = ()

    trust_score: float = 0.0
    production_ready: bool = False

    version: str = "V0"

    metadata: Mapping[str, object] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.capability_id.strip():
            raise ValueError("capability_id is required")

        if not self.name.strip():
            raise ValueError("name is required")

        if not 0.0 <= self.trust_score <= 1.0:
            raise ValueError("trust_score must be between 0 and 1")

        if (
            self.production_ready
            and self.maturity is not CapabilityMaturity.PRODUCTION_READY
        ):
            raise ValueError(
                "production_ready requires PRODUCTION_READY maturity"
            )

        if (
            self.maturity is CapabilityMaturity.PRODUCTION_READY
            and not self.production_ready
        ):
            raise ValueError(
                "PRODUCTION_READY maturity requires production_ready=True"
            )
