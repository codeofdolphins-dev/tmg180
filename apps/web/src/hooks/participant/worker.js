import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/apiClient";


export const worker = ["workerList"];

export function useWorkerList() {
    return useQuery({
        queryKey: worker,
        queryFn: () => api.get('/user/worker/list'),
        staleTime: 60_000,
    });
}