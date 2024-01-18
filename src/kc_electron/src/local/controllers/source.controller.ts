/*
 * Copyright (c) 2023-2024 Rob Royce
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Request, Response } from "express";
import { introPrompts } from "../constants/source.prompts";
import { GlobalWorkerOptions } from "pdfjs-dist";
import ChatController from "./chat.controller";
import TokenizerUtils from "../utils/tokenizer.utils";

GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

export default class SourceChatController {
  constructor(
    private tokenizerUtils: TokenizerUtils,
    private chatController: ChatController
  ) {}

  getChatController() {
    return this.chatController;
  }

  async chat(req: Request, res: Response): Promise<Response> {
    return this.chatController.chat(req, res);
  }

  async intro(req: Request, res: Response): Promise<Response> {
    // If the summary already exists, simply return it as a ChatCompletion
    if (req.body.summary) {
      console.debug(
        "[Knowledge]: Source summary already exists, returning it..."
      );
      return res.json({
        choices: [
          {
            message: {
              content: req.body.summary,
              role: "assistant",
            },
          },
        ],
      });
    }

    const source = req.body.source;
    const messages = req.body.messages || [];
    const noPrompts = messages.length === 0;

    // Get Source prompts based on this specific source, prepend them to messages
    if (noPrompts) {
      const sourceIntroPrompts = introPrompts(source, "source");
      sourceIntroPrompts.forEach((message) => {
        messages.push(message);
      });
    }

    // Extract text from web page to feed into the API
    const text = this.tokenizerUtils.limitText(req.body.text);

    // Append the extracted text to the messages before sending
    messages.push({
      role: "system",
      content: `The following is the text extracted from the Source: "${source.title}":\n=========\n"""${text}"""\n=========`,
    });

    if (noPrompts) {
      messages.push({
        role: "user",
        content: `Can you introduce me to "${source.title}"?`,
      });
    }
    return this.chatController.chat(req, res);
  }

  async regenerate(req: Request, res: Response) {
    return undefined;
  }

  async categorize(req: Request, res: Response) {
    // The request body should contain a source title and the entire project tree in YAML format
    const sourceTitle = req.body.title;
    const projectTree = req.body.yaml.replace("\n", "\\n");

    req.body.messages = [
      {
        role: "user",
        content:
          "List of projects and their subprojects:\n\n" +
          "```yaml\n" +
          `${projectTree}` +
          "```\n" +
          "---\n" +
          "Title of newly import Source:\n" +
          `> ${sourceTitle}\n` +
          "---\n" +
          "Please provide a comma separated list of the top 3 projects that this source is most likely to fit into. Do not explain your reasoning. Do not return anything other than the list of 3 projects.",
      },
    ];

    const response = await this.chatController.passthrough(req, res);

    console.log("Response: ", response);
  }
}
