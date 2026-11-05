"""SHA-256 integrity manifests for capability store files.

Each capability store file is accompanied by a sidecar manifest
(``<store>.integrity.json``) recording the SHA-256 digest and byte size.
Verification fails closed on any mismatch; detection, not authenticity.
"""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path


@dataclass(frozen=True, slots=True)
class CapabilityStoreIntegrityManifest:
    schema_version: str
    algorithm: str
    sha256: str
    size_bytes: int


class CapabilityStoreIntegrity:
    SCHEMA_VERSION = "1.0"
    ALGORITHM = "SHA-256"

    @staticmethod
    def manifest_path(store_path: str | Path) -> Path:
        path = Path(store_path).resolve()
        return path.with_suffix(path.suffix + ".integrity.json")

    @staticmethod
    def sha256(path: str | Path) -> str:
        path = Path(path).resolve()

        digest = hashlib.sha256()

        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)

        return digest.hexdigest()

    def create_manifest(
        self, store_path: str | Path
    ) -> CapabilityStoreIntegrityManifest:
        path = Path(store_path).resolve()

        if not path.is_file():
            raise FileNotFoundError(path)

        return CapabilityStoreIntegrityManifest(
            schema_version=self.SCHEMA_VERSION,
            algorithm=self.ALGORITHM,
            sha256=self.sha256(path),
            size_bytes=path.stat().st_size,
        )

    def write_manifest(
        self, store_path: str | Path
    ) -> CapabilityStoreIntegrityManifest:
        path = Path(store_path).resolve()
        manifest = self.create_manifest(path)

        manifest_path = self.manifest_path(path)

        payload = {
            "schema_version": manifest.schema_version,
            "algorithm": manifest.algorithm,
            "sha256": manifest.sha256,
            "size_bytes": manifest.size_bytes,
        }

        temp = manifest_path.with_suffix(manifest_path.suffix + ".tmp")

        temp.write_text(
            json.dumps(payload, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )

        temp.replace(manifest_path)

        return manifest

    def verify(self, store_path: str | Path) -> bool:
        path = Path(store_path).resolve()
        manifest_path = self.manifest_path(path)

        if not path.is_file():
            return False

        if not manifest_path.is_file():
            return False

        try:
            payload = json.loads(
                manifest_path.read_text(encoding="utf-8-sig")
            )
        except (OSError, json.JSONDecodeError):
            return False

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            return False

        if payload.get("algorithm") != self.ALGORITHM:
            return False

        expected_hash = payload.get("sha256")

        if not isinstance(expected_hash, str) or len(expected_hash) != 64:
            return False

        try:
            int(expected_hash, 16)
        except ValueError:
            return False

        expected_size = payload.get("size_bytes")

        if (
            not isinstance(expected_size, int)
            or isinstance(expected_size, bool)
            or expected_size < 0
        ):
            return False

        if path.stat().st_size != expected_size:
            return False

        return self.sha256(path) == expected_hash
