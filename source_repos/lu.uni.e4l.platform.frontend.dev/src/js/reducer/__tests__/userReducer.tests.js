import { userReducer } from '../userReducer';

describe('userReducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            isAuthenticate: false,
            token: null,
            user: null,
            loginFailed: false,
            error: null,
            isLoggingIn: false,
            isSignedUp: false
        };
    });

    it('should return the initial state', () => {
        expect(userReducer(undefined, {})).toEqual(expect.objectContaining({
            isAuthenticate: false,
            isLoggingIn: false
        }));
    });

    it('should handle AUTHENTICATION_REQUEST_PENDING', () => {
        const action = { type: 'AUTHENTICATION_REQUEST_PENDING' };
        const newState = userReducer(initialState, action);

        expect(newState).toEqual(expect.objectContaining({
            isLoggingIn: true,
            error: null,
            isInfoPending: true,
            loginFailed: false
        }));
    });

    it('should handle AUTHENTICATION_REQUEST_FULFILLED', () => {
        const mockToken = "fake-jwt-token";
        const action = { 
            type: 'AUTHENTICATION_REQUEST_FULFILLED', 
            payload: { data: mockToken } 
        };
        const newState = userReducer(initialState, action);

        expect(newState).toEqual(expect.objectContaining({
            isAuthenticate: true,
            token: mockToken,
            loginFailed: false,
            isLoggingIn: false,
            isSignedUp: true
        }));
    });

    it('should handle AUTHENTICATION_REQUEST_REJECTED', () => {
        const errorMsg = "Invalid credentials";
        const action = { 
            type: 'AUTHENTICATION_REQUEST_REJECTED', 
            payload: errorMsg 
        };
        const newState = userReducer(initialState, action);

        expect(newState).toEqual(expect.objectContaining({
            isAuthenticate: false,
            token: null,
            error: errorMsg,
            loginFailed: true,
            isLoggingIn: false
        }));
    });
});