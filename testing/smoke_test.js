import http from 'k6/http';
import { check, group, fail } from 'k6';
import { BaseElement } from 'k6/html';

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    vus: 3,
    duration: '1m',
};

// Create a random string of given length
function randomString(length, charset = '') {
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[(Math.random() * charset.length) | 0];
    return res;
}

function randomNumber(length, charset = '') {
    if (!charset) charset = '1234567890';
    let res = '';
    while (length--) res += charset[(Math.random() * charset.length) | 0];
    return res;
}

const NAME = `${randomString(8)}`;
// console.log(NAME);
const USERNAME = `${randomString(8)}@example.com`; // Set your own email or `${randomString(10)}@example.com`;
// console.log(USERNAME);
const PHONE = `${randomNumber(8)}`
// console.log(PHONE);

const BASE_URL = 'http://localhost:5000';

export default () => {
    const payload = JSON.stringify({
        name: NAME,
        username: NAME,
        email: USERNAME,
        password: 'pw123456',
        phone: PHONE,
      });
    
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };  

    const res = http.post(`${BASE_URL}/users`, JSON.stringify({
        name: NAME,
        username: NAME,
        email: USERNAME,
        password: 'pw123456',
        phone: PHONE,
      }), params);

    // check(res, { 'created user': (r) => r.status === 201 });
    // console.log(res.status_text);
    // console.log(USERNAME);

    const loginRes = http.post(`${BASE_URL}/users/login`, JSON.stringify({
        username: NAME,
        password: "pw123456",
    }), params);
    // console.log(loginRes.status);
    // console.log(loginRes.body)
    const authToken = loginRes.json('token');
    // console.log(authToken);
    check(authToken, { 'logged in successfully': () => authToken !== undefined });

    // set the authorization header on the session for the subsequent requests
    const requestConfigWithTag = (tag) => ({
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        tags: Object.assign(
            {},
            {
                name: 'GuestUser',
            },
            tag
        ),
    });

    const params_with_token = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
    };

    let URL = `${BASE_URL}`;

    group('01. See My Info', () => {
        const res = http.get(`${BASE_URL}/users/me`, requestConfigWithTag({ name: 'See' }));
        check(res, { 'My Info': (r) => r.status === 200 })
        // console.log(res.body);  
    });

    group('02. Fetch Cinema', () => {
        const res = http.get(`${BASE_URL}/cinemas`, requestConfigWithTag({ name: 'Cinema' }));
        check(res, { 'retrieved cinema status': (r) => r.status === 200 });
        check(res.json(), { 'retrieved cinema list': (r) => r.length > 0 });
    });

    group('03. Fetch Movies', () => {
        const res = http.get(`${BASE_URL}/movies`, requestConfigWithTag({ name: 'Movies'}));
        check(res, { 'retrieved movie Status': (r) => r.status === 200 });
        check(res.json(), { 'retrieved movie list': (r) => r.length > 0 });
    });

    group('04. Fetch Showtimes', () => {
        const res = http.get(`${BASE_URL}/showtimes`, requestConfigWithTag({ name: 'Showtimes'}));
        check(res, { 'retrieved showtime Status': (r) => r.status === 200 });
        check(res.json(), { 'retrieved showtime list': (r) => r.length > 0 });
    });
    
    group('05. Get Reservation', () => {
        const res = http.post(`${BASE_URL}/reservations`, JSON.stringify({
            date: '2023/09/24',
            startAt: "bandung",
            seats: ["A"],
            ticketPrice: 50000,
            total: 1,
            movieId: "650d3fa4dd4dc724ef947f6c",
            cinemaId: "650c5c2ee1101d1be65d8a48",
            username: NAME,
            phone: PHONE,
            checkin: false
        }), params_with_token);
        check(res, {'reservation success': (r) => r.status === 201});
        // console.log(res.status_text);
    })

};
