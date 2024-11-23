import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import {app} from "../index.js"
const chai = use(chaiHttp);
// Ejecutar npm test
describe('Respuesta del servidor funcionando', () => {
    it('La ruta /animes debe mostrar todos los animes', (done) => {
        chai.request.execute(app).get('/animes').end((error, respuesta) => {
            expect(respuesta).to.have.status(200);
            expect(respuesta.body).to.be.an('object');
            done();
        });
    });
});