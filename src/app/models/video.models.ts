export interface videoLibraryModels {
    data : videoModel,
    status : boolean
}

interface videoModel {
    message : string,
    offset : number,
    page : number,
    perpage : number
    result : videoResult []

}

interface videoResult {
    category_id : number,
    created_at : string,
    description : string,
    library_id : number,
    price : number,
    thumbnail : string,
    title: string,
    type : string,
    unlocked : number,
    user_video_purchase_id : any,
    video_type : string,
    views : number
}