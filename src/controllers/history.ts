import { RequestHandler } from "express";
import History, { HistoryType } from "#/models/history";
import { paginationQuery } from "#/@types/misc";

export const updateHistory: RequestHandler = async (req, res: any) => {
  /**Aggregation in mongoDB is a framework that enables you to process and transform documents form a collection in a variety ways.
   * Aggreagation pipelines
   */

  const oldHistory = await History.findOne({ owner: req.user.id });

  const { audio, progress, date } = req.body;

  const history: HistoryType = {
    audio,
    progress,
    date,
  };
  if (!oldHistory) {
    History.create({
      owner: req.user.id,
      last: history,
      all: [history],
    });
    return res.json({ success: true });
  }
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  // Aggregation logic to retrieve and process history data based on user and date
  const histories = await History.aggregate([
    // Stage 1: Filter the documents to find the history for the current user
    // {$match} filters the documents to only include the history of the user identified by `req.user.id`
    { $match: { owner: req.user.id } },

    // Stage 2: Flatten the 'all' array
    // {$unwind} is used to deconstruct the 'all' array, turning each item in the 'all' array into a separate document.
    // This allows us to work with each item in the array as an individual document.
    { $unwind: "$all" },

    // Stage 3: Filter the documents based on the date range
    // {$match} filters the documents where the date of each item in the 'all' array falls between 'startOfDay' and 'endOfDay'
    // This ensures we only get records from today based on the date.
    {
      $match: {
        "all.date": {
          $gte: startOfDay, // Greater than or equal to the start of the day
          $lt: endOfDay, // Less than the end of the day (exclusive)
        },
      },
    },

    // Stage 4: Project only the required fields
    // {$project} shapes the output by including only the 'audio' field from the deconstructed 'all' object
    // The '_id' field is excluded in the result with "_id: 0"
    {
      $project: {
        _id: 0, // Exclude the '_id' field from the result
        audio: "$all.audio", // Include the 'audio' field from the 'all' array
      },
    },
  ]);

  //   const sameDayHistory = histories.find((item) => {
  //     if (item.audio.toString() === audio) return item;
  //   });
  const sameDayHistory = histories.find((item) => {
    if (item.audio.toString() === audio) return item;
  });

  if (sameDayHistory) {
    await History.findOneAndUpdate(
      { owner: req.user.id, "all.audio": audio },
      {
        $set: {
          "all.$.progress": progress,
          "all.$.date": date,
        },
      }
    );
  } else {
    await History.findByIdAndUpdate(oldHistory._id, {
      $push: { all: { $each: [history], $position: 0 } },
      $set: { last: history },
    });
  }

  res.json({ success: true });
};

export const removeHistory: RequestHandler = async (req, res: any) => {
  // /history?histories = ["fasdfads", fasdfas]
  // /history?histories = ["fasdfads"]
  // /history?all=yes
  const removeAll = req.query.all === "yes";

  if (removeAll) {
    //if removeAll === true remove all History
    await History.findOneAndDelete({
      owner: req.user.id,
    });
    return res.json({ succes: true });
  }

  //  /history?histories=["fasdfads", fasdfas]
  const histories = req.query.histories as string;
  const ids = JSON.parse(histories) as string;
  await History.findOneAndUpdate(
    { owner: req.user.id },
    {
      $pull: { all: { _id: ids } },
    }
  );
  res.json({ succes: true });
};

export const getHistories: RequestHandler = async (req, res: any) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const histories = await History.aggregate([
    // match histories by owner id
    { $match: { owner: req.user.id } },
    {
      // project thistories by slciing all objet based on pageNo and limit
      $project: {
        all: {
          $slice: ["$all", parseInt(limit) * parseInt(pageNo), parseInt(limit)],
        },
      },
    },
    // now we  want  to find teh heaidng and other record for an audio
    { $unwind: "$all" }, // Deconstructs the 'all' array so each element becomes a separate document for processing

    {
      //Performs a left outer join between all.audio and _id in the audios collection, embedding the result as audioInfo.
      $lookup: {
        from: "audios", // The name of the collection to join with (the 'audios' collection)
        localField: "all.audio", // The field from the 'all' array that we're matching with the 'audios' collection
        foreignField: "_id", // The field in the 'audios' collection to match against
        as: "audioInfo", // The name of the new array field to add with matched documents from 'audios'
      },
    },
    { $unwind: "$audioInfo" },
    {
      $project: {
        _id: 0,
        id: "$all._id",
        audioId: "$audioInfo._id",
        date: "$all.date",
        title: "$audioInfo.title",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        audios: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        // date: "$_id",
        audios: "$$ROOT.audios",
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ]);
  res.json({ histories });
};

export const getRecentlyPlayed: RequestHandler = async (req, res: any) => {
  const match = { $match: { owner: req.user.id } };
  const sliceMatch = {
    $project: {
      myHistory: { $slice: ["$all", 10] },
    },
  };
  const dateSort = {
    $project: {
      histories: {
        $sortArray: {
          input: "$myHistory",
          sortBy: { date: -1 },
        },
      },
    },
  };
  const unWindWithIndex = {
    $unwind: { path: "$histories", includeArrayIndex: "index" },
  };
  const audioLookUp = {
    $lookup: {
      from: "audios",
      localField: "histories.audio",
      foreignField: "_id",
      as: "audioInfo",
    },
  };
  const unwindAudioInfo = {
    $unwind: { path: "$audioInfo" },
  };
  const userLookup = {
    $lookup: {
      from: "users", //schem name of wher to lock 
      localField: "audioInfo.owner", //mathch with 
      foreignField: "_id", //Scheam id 
      as: "owner", //name as 
    },
  };
  const projectResult ={
    $project:{
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        category: "$audioInfo.category",
        owner: {name: "$owner.name", id: "$owner._id"},
        date: "$histories.date",
        progress: "$histories.progress"
    }
} 
  const unwindUser =    {$unwind: { path :"$owner" }}
  const audios = await History.aggregate([
    match,
    sliceMatch,
    dateSort,
    unWindWithIndex,
    audioLookUp,
    unwindAudioInfo,
    userLookup,
    unwindUser,
    projectResult
  ]);
  res.json({ audios });
};
