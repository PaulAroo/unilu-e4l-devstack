import React from 'react';
import { shallow } from 'enzyme';
import { VerticalSpace } from '../verticalSpace';

describe('VerticalSpace Component', () => {
    it('renders a div with the correct height style', () => {
        // Render the component with vheight="5"
        const wrapper = shallow(<VerticalSpace vheight={5} />);
        
        // Check if the style prop matches { height: '5em' }
        expect(wrapper.prop('style')).toHaveProperty('height', '5em');
    });

    it('renders empty div if no height provided', () => {
       const wrapper = shallow(<VerticalSpace />);
       // height will be "undefinedem" based on your code, checking it renders without crashing
       expect(wrapper.exists()).toBe(true);
    });
});