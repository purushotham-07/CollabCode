// MongoDB Replica Set initialization script for local development
try {
  const status = rs.status();
  print("Replica set already initialized: " + status.set);
} catch (e) {
  print("Initializing replica set rs0...");
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo:27017" }
    ]
  });
  print("Replica set rs0 initialized successfully.");
}
