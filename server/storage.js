const useDatabase = !!process.env.DATABASE_URL;

let storageImpl;
if (useDatabase) {
  const mod = await import("./storage.db.js");
  storageImpl = new mod.DatabaseStorage();
} else {
  const mod = await import("./storage.file.js");
  storageImpl = new mod.FileStorage();
}

export const storage = storageImpl;
