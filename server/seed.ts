import pg from "pg";

const seedDatabase = async () => {
  const client = new pg.Client({
    user: "admin",
    host: "localhost",
    database: "notes",
    password: "admin1",
    port: 5432,
  });

  try {
    await client.connect();

    await client.query("SET search_path TO public");

    const tableResult = await client.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notes')"
    );

    if (!tableResult.rows[0].exists) {
      await client.query(
        "CREATE TABLE notes (id SERIAL PRIMARY KEY, content VARCHAR(255))"
      );
      console.log('Table "notes" created.');
    } else {
      console.log('Table "notes" already exists.');
    }

    await client.query("DELETE FROM notes");

    const sampleNotes = [
      { content: "Sample Note 1" },
      { content: "Sample Note 2" },
    ];

    for (const note of sampleNotes) {
      await client.query("INSERT INTO notes (content) VALUES ($1)", [
        note.content,
      ]);
    }

    // Retrieve and log the contents of the 'notes' table
    const res = await client.query("SELECT * FROM notes");
    console.log('Contents of the "notes" table:', res.rows);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Always close the connection
    await client.end();
  }
};

// Run the seed function
seedDatabase();
