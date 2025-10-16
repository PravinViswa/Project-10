use rand::Rng;
pub fn transpose(board:&Vec<Vec<u32>>)->Vec<Vec<u32>>{
    if board.is_empty(){
        return vec![];
    }
    let inner_len=board[0].len();
    let mut transposed=vec![vec![0;board.len()];inner_len];
    for (i,row) in board.iter().enumerate(){
        for (j,&val) in row.iter().enumerate(){
            transposed[j][i]=val;
        }
    }
    transposed
}

fn slide_and_combine(row:&[u32],len:usize)->(Vec<u32>,u32) {
    let mut new_row_filtered:Vec<u32>=row.iter().filter(|&&v|v!=0).cloned().collect();
    let mut score=0;
    let mut i=0;
    while i<new_row_filtered.len().saturating_sub(1){
        if new_row_filtered[i]==new_row_filtered[i + 1]{
            new_row_filtered[i]*=2;
            score+=new_row_filtered[i];
            new_row_filtered.remove(i+1);
        }
        i+=1;
    }
    new_row_filtered.resize(len,0);
    (new_row_filtered,score)
}

pub fn move_core_game(board:&Vec<Vec<u32>>,_width:usize,_height:usize,direction:&str)->(Vec<Vec<u32>>,u32,bool){
    let mut new_board=board.clone();
    let mut score=0;
    let original_board_json=serde_json::to_string(&new_board).unwrap_or_default();

    let is_vertical=direction=="up"||direction=="down";

    if is_vertical{
        new_board=transpose(&new_board);
    }
    if direction=="right"||direction=="down"{
        new_board.iter_mut().for_each(|row|row.reverse());
    }

    let row_len=if !new_board.is_empty(){new_board[0].len()} else{0};

    for row in new_board.iter_mut(){
        let(processed_row,row_score)=slide_and_combine(row,row_len);
        *row=processed_row;
        score+=row_score;
    }

    if direction=="right"||direction=="down"{
        new_board.iter_mut().for_each(|row|row.reverse());
    }
    if is_vertical{
        new_board=transpose(&new_board);
    }
    
    let changed=serde_json::to_string(&new_board).unwrap_or_default()!=original_board_json;

    (new_board,score,changed)
}

pub fn add_random_tile(board:&Vec<Vec<u32>>)->Vec<Vec<u32>>{
    let mut empty_tiles=Vec::new();
    for (r,row) in board.iter().enumerate(){
        for (c,&val) in row.iter().enumerate(){
            if val==0{
                empty_tiles.push((r,c));
            }
        }
    }
    if empty_tiles.is_empty(){
        return board.clone();
    }
    let mut new_board=board.clone();
    let (r, c)=empty_tiles[rand::thread_rng().gen_range(0..empty_tiles.len())];
    new_board[r][c]=if rand::thread_rng().gen_bool(0.9){2} else{4};
    new_board
}

pub fn check_game_status(board:&Vec<Vec<u32>>)->(bool, bool){
    let height =board.len();
    if height==0{return(false,true);}
    let width=board[0].len();
    if width==0{return(false,true);}

    let mut is_won=false;
    let mut has_empty_tile=false;
    let mut can_move=false;

    for r in 0..height{
        for c in 0..width{
            if board[r][c]==2048{is_won=true;}
            if board[r][c]==0{has_empty_tile=true;}
            if r<height-1&&board[r][c]==board[r+1][c]{can_move=true;}
            if c<width-1&&board[r][c]==board[r][c+1]{can_move=true;}
        }
    }
    let is_lost =!has_empty_tile&&!can_move;
    (is_won,is_lost)
}