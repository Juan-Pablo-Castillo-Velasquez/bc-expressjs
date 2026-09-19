import 'dotenv/config';
import { app } from './app';
import { connectDB } from './lib/mongoose';

const PORT = process.env['PORT'] ?? '3000';

async function main(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
