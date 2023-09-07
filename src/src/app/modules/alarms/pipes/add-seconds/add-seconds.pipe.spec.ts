import {AddSecondsPipe} from './add-seconds.pipe';

describe('AddSecondsPipe', () => {
  it('create an instance', () => {
    const pipe = new AddSecondsPipe();
    expect(pipe).toBeTruthy();
  });
});
