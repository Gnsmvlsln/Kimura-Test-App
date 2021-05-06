export interface rangeModal {
    data : range,
    status : boolean
}

interface range {
    message : string,
    rating : rangeRating
}

interface rangeRating {
    id : number,
    media_id : number,
    rating : number,
    user_id : number
}

export interface videosInterface {
    data : videoResponse,
    status : boolean
}

interface videoResponse {
    message : string,
    offset : number,
    page : number,
    perpage : number,
    result : [],
    total : number,
    video : videoDetails
}

interface videoDetails {
    avg_rating : string,
    created_at : string,
    description : string,
    file_id : number,
    franchisee_id : number,
    id : number,
    media_id : number,
    rating : string,
    share_url : string,
    source : string,
    status : number,
    thumbnail : string,
    title : string,
    total_comments : number,
    total_likes : number,
    total_views : number,
    updated_at  : string,
    uri : string,
    user_liked: number,
    user_rating : string,
    user_watched_time : number
}