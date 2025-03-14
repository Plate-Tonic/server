# PlateTonic Server

### Contributors

Van Nguyen - [GitHub](https://github.com/montsieur)

Veronica Chung - [GitHub](https://github.com/chung-v)

### Deployed Application

- Front End:[https://platetonic.netlify.app](https://platetonic.netlify.app/)

- Back End: [https://platetonic.onrender.com](https://platetonic.onrender.com)

### Repositories

- Documentation: [Plate-Tonic/part-b](https://github.com/Plate-Tonic/platetonic-part-b)

- Front End: [Plate-Tonic/client](https://github.com/Plate-Tonic/client)

- Back End: [Plate-Tonic/server](https://github.com/Plate-Tonic/server)

# Application Setup

1. Clone the repository.

```
git@github.com:Plate-Tonic/server.git
cd server
```

2. Create your `.env` file in the root directory.

```
PORT="your-port"
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
```

3. Start MongoDB.

```
sudo systemctl start mongod
```

4. Install dependencies.

```
npm install
```

5. Seed data into the database.

```
npm run seed
```

6. Run the application.

```
npm run dev
```
