import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Mock IntersectionObserver which is not available in JSDOM
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};