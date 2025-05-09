# Sistema di Trouble Ticketing

Un'applicazione moderna per la gestione dei ticket di supporto, progettata per facilitare la collaborazione del team e la gestione efficiente dei problemi.

## Stack Tecnologico

- **Backend**: Spring Boot 2.7.x (Java 17)
- **Frontend**: Angular 14+
- **Database**: PostgreSQL 14
- **Autenticazione**: Keycloak 19
- **Containerizzazione**: Docker e Docker Compose

## Funzionalità principali

- Dashboard con statistiche in tempo reale
- Gestione completa dei ticket (creazione, assegnazione, aggiornamento)
- Sistema di commenti e notifiche
- Gestione utenti con ruoli e permessi
- Categorizzazione dei ticket
- Storico delle modifiche ai ticket
- Reportistica e analisi dati

## Requisiti

- Docker e Docker Compose
- JDK 17 (per sviluppo locale)
- Node.js 16+ e npm (per sviluppo locale)

## Avvio rapido

1. Clona il repository:
   ```bash
   git clone [URL-del-repository]
   cd trouble-ticketing
   ```

2. Avvia i servizi con Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Accedi all'applicazione:
   - Frontend: http://localhost:4200
   - Keycloak Admin: http://localhost:8080/admin (admin/admin)
   - API: http://localhost:8081/api

4. Utenti predefiniti:
   - Admin: admin/password
   - Agente: agent/password
   - Utente: user/password

## Sviluppo locale

### Backend (Spring Boot)

1. Naviga nella directory del backend:
   ```bash
   cd backend
   ```

2. Avvia l'applicazione in modalità sviluppo:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

### Frontend (Angular)

1. Naviga nella directory del frontend:
   ```bash
   cd frontend
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm start
   ```

## Struttura del progetto

```
/
├── backend/                 # Backend Spring Boot
│   ├── src/                 # Codice sorgente
│   │   ├── main/
│   │   │   ├── java/       # Codice Java
│   │   │   └── resources/  # Configurazioni
│   │   └── test/           # Test unitari e integrazione
│   ├── pom.xml             # Configurazione Maven
│   └── Dockerfile          # Immagine Docker per il backend
│
├── frontend/               # Frontend Angular
│   ├── src/                # Codice sorgente
│   │   ├── app/            # Componenti, servizi, modelli
│   │   ├── assets/         # Risorse statiche
│   │   └── environments/   # Configurazioni per ambienti
│   ├── package.json        # Dipendenze npm
│   └── Dockerfile          # Immagine Docker per il frontend
│
├── keycloak/               # Configurazione Keycloak
│   └── data/               # Dati predefiniti per realm e utenti
│
└── docker-compose.yml      # Configurazione Docker Compose
```