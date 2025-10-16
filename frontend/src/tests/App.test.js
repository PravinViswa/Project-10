import React from 'react';
import {render,screen,fireEvent } from '@testing-library/react';
import App from './App';

//Mocking the api module to prevent actual network requests during tests
jest.mock('./utils/api',()=>({
  startGame:jest.fn().mockResolvedValue({
    player_id:'test_player',
    passcode:'1234',
    board:[
      [0,0,0,0],
      [0,2,0,0],
      [0,0,2,0],
      [0,0,0,0],
    ],
    score:0,
    best_score:100,
    is_game_over:false,
    is_game_won:false,
    grid_width:4,
    grid_height:4,
  }),
}));

describe('App Component',()=>{
  test('renders the login page by default',()=>{
    render(<App />);
    
    //Check for the main title on the login screen
    const titleElement=screen.getByText(/2048/i);
    expect(titleElement).toBeInTheDocument();

    //Check for a button unique to the login page
    const guestButton=screen.getByRole('button',{name:/play as guest/i});
    expect(guestButton).toBeInTheDocument();
  });

  test('switches to the game page when "Play as Guest" is clicked',()=>{
    render(<App />);
    
    //Find and click the "Play as Guest" button
    const guestButton=screen.getByRole('button',{name:/play as guest/i});
    fireEvent.click(guestButton);

    //After clicking,the game page should be visible.
    //We can check for an element that only appears on the game page,like the score.
    const scoreElement=screen.getByText(/SCORED:/i);
    expect(scoreElement).toBeInTheDocument();

    //We can also check that a login page button is no longer present
    expect(guestButton).not.toBeInTheDocument();
  });

  test('renders the create player page when "Create New Player" is clicked',()=>{
    render(<App />);

    const createPlayerButton=screen.getByRole('button',{name:/create new player/i});
    fireEvent.click(createPlayerButton);

    //Check for a heading that is unique to the create player page
    const createPlayerHeading=screen.getByRole('heading',{name:/create new player/i});
    expect(createPlayerHeading).toBeInTheDocument();
  });
});