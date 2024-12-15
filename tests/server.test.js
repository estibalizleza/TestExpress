const request = require('supertest');
const PORT = process.env.PORT || 4444;
const url = `http://localhost:${PORT}`


describe('Testing index', () => {
    it('GET /', async () => {
        const res = await request(url).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.type).toMatch(/json/);
    });

    it("POST /send", async () => {
        // Reset the fakeDB before each test
        await request(url).post("/reset").send();


        let res = await request(url).get("/");
        console.log(res.body.data);
        expect(res.body.data.length).toBe(0);


        res = await request(url).post("/send").send({
            email: "janire@example.com",
        });


        expect(res.type).toMatch(/json/);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].email).toMatch("janire@example.com");
    });

    it("DELETE /destroy/:id", async () => {
        const res = await request(url).get('/');
        const luzera = res.body.data.length
        // orduan azken elementua luzera -1 posizioan egongo da
        const id = res.body.data[luzera - 1].id


        const response = await request(url).delete(`/destroy/${id}`);
        expect(response.type).toMatch(/json/)
        expect(res.statusCode).toBe(200);
        expect(response.body.data.length).toBe(luzera - 1)


    });

    it("PUT /update/:id", async () => {
        //reset egin
        await request(url).post("/reset").send();
      
        await request(url).post("/send").send({
          email: "janire@example.com",
        });
        
        const res = await request(url).get('/');
        const id = res.body.data[0].id;
        const response = await request(url).put(`/update/${id}`).send({
          email: "erabiltzaile@example.com",
        });

        expect(response.type).toMatch(/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].email).toBe("erabiltzaile@example.com");
      });
      



});
