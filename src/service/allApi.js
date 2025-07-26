import { commonAPI } from "./commonApi"
import { serverURL } from "./serverURL"


// add transactions
export const addTransactionAPI = async (reqBody)=>{
    return await commonAPI("POST", `${serverURL}/transactions`,reqBody)
}

// get transactions
export const getTransactionAPI = async ()=>{
    return await commonAPI("GET", `${serverURL}/transactions`,"")
}

// update transactions
export const updateTransactionAPI = async (id, reqBody)=>{
    return await commonAPI("PUT", `${serverURL}/transactions/${id}`,reqBody)
}

// detele transaction
export const deleteTransactionAPI = async (id)=>{
    return await commonAPI("DELETE", `${serverURL}/transactions/${id}`,"")
}