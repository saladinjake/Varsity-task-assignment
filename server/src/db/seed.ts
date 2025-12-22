import { getDb, setupTables } from './index';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        const db = await getDb();
        console.log('--- Initializing Global Database Terminal ---');

        await db.exec('DROP TABLE IF EXISTS reviews');
        await db.exec('DROP TABLE IF EXISTS enrollments');
        await db.exec('DROP TABLE IF EXISTS lessons');
        await db.exec('DROP TABLE IF EXISTS modules');
        await db.exec('DROP TABLE IF EXISTS courses');
        await db.exec('DROP TABLE IF EXISTS categories');
        await db.exec('DROP TABLE IF EXISTS quizzes');
        await db.exec('DROP TABLE IF EXISTS users');

        console.log('--- Re-initializing Schema ---');
        await setupTables(db);

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Initial Entity Population
        await db.run(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            ['Jane Student', 'jane@varsity.com', hashedPassword, 'student', 1]
        );
        await db.run(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            ['Dr. Instructor', 'instructor@varsity.com', hashedPassword, 'instructor', 1]
        );
        await db.run(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            ['Admin User', 'admin@varsity.com', hashedPassword, 'admin', 1]
        );
        await db.run(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            ['Pending Instructor', 'pending@varsity.com', hashedPassword, 'instructor', 0]
        );

        // Categories
        await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Web Development', 'web-dev']);
        await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['AI & Machine Learning', 'ai-ml']);
        await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Cloud Computing', 'cloud']);
        await db.run('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Cybersecurity', 'security']);

        // Helper to generate courses
        const courses = [
            {
                instructorId: 2,
                catId: 1,
                title: 'Modern React Architecture',
                slug: 'react-arch',
                subtitle: 'Professional patterns for high-performance React apps.',
                desc: 'A deep dive into server components, state management, and edge performance.',
                price: 49.99,
                published: 1,
                previewVideo: 'dShpZ-sVvS8', // React JS Crash Course
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400'
            },
            {
                instructorId: 2,
                catId: 1,
                title: 'Foundations of Node.js',
                slug: 'node-foundations',
                subtitle: 'Master the backend with asynchronous programming.',
                desc: 'Learn streams, event loop, and express architectures.',
                price: 0,
                published: 1,
                previewVideo: 'fBNz5xF-Kx4', // Node.js Tutorial
                thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400'
            },
            {
                instructorId: 2,
                catId: 2,
                title: 'AI Engineering with Python',
                slug: 'ai-python',
                subtitle: 'Build intelligent applications with OpenAI and LangChain.',
                desc: 'Practical AI development for modern software engineers.',
                price: 129.99,
                published: 1,
                previewVideo: 'aqvDIn9AByM', // Generative AI for Beginners
                thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400'
            },
            {
                instructorId: 2,
                catId: 3,
                title: 'AWS Architect Associate',
                slug: 'aws-architect',
                subtitle: 'Master cloud infrastructure and design patterns.',
                desc: 'Prepare for AWS certification with hands-on labs.',
                price: 79.99,
                published: 1,
                previewVideo: 'SOTamWNgDKc', // AWS Course
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400'
            },
            {
                instructorId: 2,
                catId: 1,
                title: 'TypeScript for Enterprise',
                slug: 'ts-enterprise',
                subtitle: 'Advanced type-safety and structural patterns.',
                desc: 'Take your TS skills beyond the basics for massive scale.',
                price: 39.99,
                published: 1,
                previewVideo: 'BwuLxPH8IDs', // TypeScript Tutorial
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400'
            },
            {
                instructorId: 2,
                catId: 4,
                title: 'Ethical Hacking 101',
                slug: 'security-101',
                subtitle: 'Learn the defensive side of cybersecurity.',
                desc: 'Network scanning, vulnerability assessment and more.',
                price: 0,
                published: 1,
                previewVideo: 'fNzpcB7ODnE', // Cyber Security Course
                thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=400'
            }
        ];

        for (const c of courses) {
            const result = await db.run(
                'INSERT INTO courses (instructor_id, category_id, title, slug, subtitle, description, price, is_published, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [c.instructorId, c.catId, c.title, c.slug, c.subtitle, c.desc, c.price, c.published, c.thumbnail]
            );
            const courseId = result.lastID!;

            // Add Modules and Lessons with real videos
            const mod1 = await db.run('INSERT INTO modules (course_id, title, sort_order) VALUES (?, ?, ?)', [courseId, 'Strategic Overview', 1]);
            const mod2 = await db.run('INSERT INTO modules (course_id, title, sort_order) VALUES (?, ?, ?)', [courseId, 'Technical Implementation', 2]);
            const mod3 = await db.run('INSERT INTO modules (course_id, title, sort_order) VALUES (?, ?, ?)', [courseId, 'Production & Optimization', 3]);

            // Module 1 Lessons
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod1.lastID!, courseId, 'System Archetype Introduction', `https://www.youtube.com/embed/${c.previewVideo}`, 12, 1, 1]);
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod1.lastID!, courseId, 'Protocol Foundations', `https://www.youtube.com/embed/${c.previewVideo}`, 18, 2, 1]);

            // Module 2 Lessons
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod2.lastID!, courseId, 'Core Engine Mechanics', `https://www.youtube.com/embed/${c.previewVideo}`, 45, 1, 0]);
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod2.lastID!, courseId, 'Advanced Structural Patterns', `https://www.youtube.com/embed/${c.previewVideo}`, 32, 2, 0]);
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod2.lastID!, courseId, 'Laboratory: Real-world Stress Test', `https://www.youtube.com/embed/${c.previewVideo}`, 58, 3, 0]);

            // Module 3 Lessons
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod3.lastID!, courseId, 'Deployment Protocols', `https://www.youtube.com/embed/${c.previewVideo}`, 24, 1, 0]);
            await db.run('INSERT INTO lessons (module_id, course_id, title, video_url, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mod3.lastID!, courseId, 'Scaling Strategies & Buffering', `https://www.youtube.com/embed/${c.previewVideo}`, 19, 2, 0]);
        }

        console.log('--- Database Seeding Successful ---');
    } catch (err) {
        console.error('--- Seeding Error: ---', err);
    }
}

seed();
