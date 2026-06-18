from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Neo4j
    NEO4J_URI: str = ""
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = ""

    # Override: force mock data even when Neo4j URI is set
    USE_MOCK_DATA: bool = False

    # Frontend origin for CORS (space-separated if multiple)
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    @property
    def use_mock(self) -> bool:
        """Returns True when mock data should be used."""
        return self.USE_MOCK_DATA or not self.NEO4J_URI.strip()


settings = Settings()

