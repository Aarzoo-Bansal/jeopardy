const {
    request,
    pool,
    getAuthToken,
    createTestCategory,
    createTestQuestion
} = require('../helpers');

describe('Questions API', () => {
    let authUser, token, category;

    beforeEach(async () => {
        ({ user: authUser, token } = await getAuthToken());
        category = await createTestCategory(authUser.id, { name: 'Science' });
    });

    // ─── CREATE ──────────────────────────────────────────────────
    describe('POST /api/questions', () => {
        it('creates a question under an owned category', async () => {
            const res = await request
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category_id: category.id,
                    difficulty: 300,
                    question: 'What planet is closet to the Sun?',
                    answer: 'Mercury',
                    time_limit: 45
                });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                category_id: category.id,
                difficulty: 300,
                question: 'What planet is closet to the Sun?',
                answer: 'Mercury',
                time_limit: 45
            });
        });

        it('defaults time limit to 30 when not provided', async () => {
            const res = await request
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category_id: category.id,
                    difficulty: 100,
                    question: 'Test question?',
                    answer: 'Test answer',
                });

            expect(res.status).toBe(201);
            expect(res.body.time_limit).toBe(30);
        });

        it('rejects question for category owned by some other user', async () => {
            const { user: other } = await getAuthToken({
                email: 'other@example.com'
            });

            const theirCategory = await createTestCategory(other.id);

            const res = await request
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category_id: theirCategory.id,
                    difficulty: 100,
                    question: 'Sneak attack!!',
                    answer: 'Blocked'
                });

            expect(res.status).toBe(404);
        });

        it('rejects missing required fields', async () => {
            const res = await request
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category_id: category.id
                    // Missing question, answer and difficulty
                });

            expect(res.status).toBe(400);
        });

        it('rejects invalid difficulty value', async () => {
            const res = await request
                .post('/api/questions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category_id: category.id,
                    difficulty: 250,
                    question: 'What planet is closet to the Sun?',
                    answer: 'Mercury',
                    time_limit: 45
                });

            expect(res.status).toBe(400);
        });

        it('accepts all valid difficulty values', async () => {
            for (const difficultyVal of [100, 200, 300, 400, 500]) {
                const res = await request
                    .post('/api/questions')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        category_id: category.id,
                        difficulty: difficultyVal,
                        question: `Question worth ${difficultyVal}`,
                        answer: 'Answer'
                    });

                expect(res.status).toBe(201);
            }
        });

        it('rejects creation without a token', async () => {
            const res = await request
                .post('/api/questions')
                .send({
                    category_id: category.id,
                    difficulty: 100,
                    question: 'Test?',
                    answer: 'Yes'
                });

            expect(res.status).toBe(401);
        });
    });

    // ─── READ ────────────────────────────────────────────────────
    describe('GET /api/questions', () => {
        it('returns all the questions for the authenticated user', async () => {
            await createTestQuestion(category.id, authUser.id, {
                difficulty: 100,
                question: 'Q1',
                answer: 'A1'
            });

            await createTestQuestion(category.id, authUser.id, {
                difficulty: 200,
                question: 'Q2',
                answer: 'A2'
            });

            const res = await request
                .get('/api/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
        });

        it('returns questions order by difficulty ascending', async () => {
            await createTestQuestion(category.id, authUser.id, {
                difficulty: 500,
                question: 'Hard',
                answer: 'A',
            });
            await createTestQuestion(category.id, authUser.id, {
                difficulty: 100,
                question: 'Easy',
                answer: 'A',
            });

            const res = await request
                .get('/api/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(res.body[0].difficulty).toBe(100);
            expect(res.body[1].difficulty).toBe(500);
        });

        it('includes category_name in the response (JOIN works)', async () => {
            await createTestQuestion(category.id, authUser.id);

            const res = await request
                .get('/api/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(res.body[0]).toHaveProperty('category_name', 'Science');
        });

        it('does not return questions owned by other users', async () => {
            await createTestQuestion(category.id, authUser.id, {
                question: 'My question',
                answer: 'My answer'
            });

            const { user: other } = await getAuthToken({
                email: 'other@example.com'
            });

            const otherCategory = await createTestCategory(other.id, {
                name: 'Other Science'
            });

            const otherQuestion = await createTestQuestion(otherCategory.id, other.id, {
                question: 'Their question',
                answer: 'Their answer'
            });

            const res = await request
                .get('/api/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(res.body).toHaveLength(1);
            expect(res.body[0].question).toBe('My question');
        });
    });

    describe('PUT /api/questions/:id', () => {
        it('updates own question', async () => {
            const question = await createTestQuestion(category.id, authUser.id);

            const res = await request
                .put(`/api/questions/${question.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ answer: 'Updated answer' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', question.id);

            const dbCheck = await pool.query(
                'SELECT * FROM questions WHERE id = $1',
                [question.id]
            );

            expect(dbCheck.rows[0].answer).toBe('Updated answer');
        });

        it('allows partial updates, only fields sent are updated', async () => {
            const question = await createTestQuestion(category.id, authUser.id, {
                difficulty: 100,
                question: 'Original Question',
                answer: 'Original Answer'
            });

            const res = await request
                .put(`/api/questions/${question.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    difficulty: 200
                });

            const dbCheck = await pool.query(`
                SELECT * FROM questions WHERE id = $1`,
                [question.id]
            );

            expect(dbCheck.rows[0].difficulty).toBe(200);
            expect(dbCheck.rows[0].question).toBe('Original Question');
            expect(dbCheck.rows[0].answer).toBe('Original Answer');
        });

        it('rejects updates with no fields', async () => {
            const question = await createTestQuestion(category.id, authUser.id);

            const res = await request
                .put(`/api/questions/${question.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(res.status).toBe(400);
        });

        it('returns 404 for other user\'s question (hides existence)', async () => {
            const { user: other } = await getAuthToken({
                email: 'other@example.com'
            });

            const otherCategory = await createTestCategory(other.id);
            const otherQuestion = await createTestQuestion(otherCategory.id, other.id);

            const res = await request
                .put(`/api/questions/${otherQuestion.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ answer: 'Hacked' });

            expect(res.status).toBe(404);

        });
    });

    // ─── DELETE ──────────────────────────────────────────────────

  describe('DELETE /api/questions/:id', () => {
    it('deletes own question', async () => {
      const question = await createTestQuestion(category.id, authUser.id);

      const res = await request
        .delete(`/api/questions/${question.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      // Verify it's gone
      const dbCheck = await pool.query(
        'SELECT * FROM questions WHERE id = $1',
        [question.id]
      );
      expect(dbCheck.rows).toHaveLength(0);
    });

    it('returns 404 for another user\'s question', async () => {
      const { user: other } = await getAuthToken({
        email: 'other@example.com',
      });
      const otherCategory = await createTestCategory(other.id);
      const theirQuestion = await createTestQuestion(
        otherCategory.id,
        other.id
      );

      const res = await request
        .delete(`/api/questions/${theirQuestion.id}`)
        .set('Authorization', `Bearer ${token}`);

      // Your route returns 403 — change to 404 to hide existence
      expect(res.status).toBe(404);
    });

    it('returns 404 for non-existent question', async () => {
      const res = await request
        .delete('/api/questions/99999')
        .set('Authorization', `Bearer ${token}`);

      // 403 from your current code — same note about 404
      expect(res.status).toBe(404);
    });
  });
});