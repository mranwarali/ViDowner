import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Platform, VideoApiResponse, VideoResult } from "../types";

const emptyResult: VideoResult = { thumb: "", urls: [], title: "" };

interface DownloadState {
  status: "idle" | "loading" | "succeeded" | "failed";
  result: VideoResult;
  error: string | null;
}

const initialState: DownloadState = {
  status: "idle",
  result: emptyResult,
  error: null,
};

const endpoints: Record<Platform, string> = {
  yt: "http://localhost:3030/api/v1/yt",
  tw: "http://localhost:3030/api/v1/tw",
  fb: "http://localhost:3030/api/v1/fb",
  ig: "http://localhost:3030/api/v1/ig",
};

export const fetchDownload = createAsyncThunk<
  VideoResult,
  { url: string; type: Platform },
  { rejectValue: string }
>("download/fetch", async ({ url, type }, thunkApi) => {
  try {
    const response = await fetch(endpoints[type], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: url }),
    });

    const result = (await response.json()) as VideoApiResponse;

    if ("error" in result) {
      return thunkApi.rejectWithValue(result.error);
    }

    return result;
  } catch {
    return thunkApi.rejectWithValue("An unexpected error occurred. Please try again later.");
  }
});

const downloadSlice = createSlice({
  name: "download",
  initialState,
  reducers: {
    resetDownload: () => initialState,
    setManualError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.result = emptyResult;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownload.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.result = emptyResult;
      })
      .addCase(fetchDownload.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.result = action.payload;
        state.error = null;
      })
      .addCase(fetchDownload.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An unexpected error occurred. Please try again later.";
        state.result = emptyResult;
      });
  },
});

export const { resetDownload, setManualError } = downloadSlice.actions;
export default downloadSlice.reducer;
