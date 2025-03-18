<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\User;
use App\Models\Word;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Expr\Cast\Object_;

class CategoryController extends Controller
{
    //Everything related to creating categories
    public function checkCategoryDuplicated($request, $privacy, $editCategory)
    {
        $canCreate = false;

        //Check if the category is duplicated.
        $findDuplicated = Category::where('name', strtoupper($request->name))
            ->where('creator_id', $request->session()->get('userId'))
            ->where('privacy', $privacy)
            ->count();

        if ($editCategory) {
            //If the count is 0 we will edit it. If it's 1 we will check if the repeated name is the category itself. 
            //This would mean that the category name hasn't been edited.
            if ($findDuplicated == 1) {
                //Check if the duplicated name is the category itself
                $findDuplicatedName = Category::where('id', $request->category_id)
                    ->where('name', strtoupper($request->name))
                    ->where('creator_id', $request->session()->get('userId'))
                    ->where('privacy', $privacy)
                    ->count();
                if ($findDuplicatedName == 1) {
                    $canCreate = true;
                }
            } else if ($findDuplicated == 0) {
                $canCreate = true;
            }
        } else {
            //If the count is 0 it means we can create it because it's not duplicated.
            if ($findDuplicated == 0) {
                $canCreate = true;
            }
        }

        return $canCreate;
    }

    public function checkUserLogged($request)
    {
        $userId = null;

        if ($request->token != null && $request->token != "null") {
            //Check if the user is logged, returns 'null' if the user is not logged in.
            [$id, $token] = explode('|', $request->token, 2);
            $accessToken = PersonalAccessToken::find($id);

            if ($accessToken != null) {
                if (hash_equals($accessToken->token, hash('sha256', $token))) {
                    $userId = $accessToken->tokenable_id;
                    $request->session()->put('userId', $userId);
                }
            }
        }

        return $userId;
    }

    public function addCategory(Request $request)
    {
        $wrongWords = [];
        $invalidWords = [];
        $createCategory = false;
        $categoryAdded = (object)[];

        //Set privacy
        $privacy = 'private';
        if ($request->public == "true") {
            $privacy = 'public';
        }

        $validator =  Validator::make($request->all(), [
            'name' => 'required|min:3|max:20',
        ]);

        //If the validation does not fail we continue.
        if ($validator->fails()) {
            $sendCategory = (object)
            [
                "valid" => false,
                'message' => "The category name should be at least 3 characters long with a maximum of 20."
            ];
        } else {
            //Check if the user is logged in.
            $userId = $this->checkUserLogged($request);
            $createCategory = false;

            //If the user is logged in we check if we can create the category.
            if ($userId != null) {
                $editCategoryName = false;
                $createCategory = $this->checkCategoryDuplicated($request, $privacy, $editCategoryName);
                            //If we can create the category we add it with the user id after checking that all the words are valid.

            if ($createCategory) {
                $allWordsAreValid = true;
                $words = (json_decode($request->words));

                if (count($words) < 3 || count($words) > 100) {
                    $sendCategory = (object)
                    [
                        "valid" => false,
                        'message' => 'There should be at least 3 words in the category, with a maximum of 100.',
                    ];
                } else {
                    //Check that each word is valid.
                    for ($i = 0; $i < count($words); $i++) {
                        $currentWord = $words[$i]->name;
                        if (strlen($currentWord) < 3 || strlen($currentWord) > 20) {
                            if (!in_array(strtolower($currentWord), $invalidWords)) {
                                array_push($invalidWords, strtolower($currentWord));
                                $allWordsAreValid = false;
                            }
                        }
                    }

                    if ($allWordsAreValid) {
                        //Check for each word if it already exists.
                        for ($i = 0; $i < count($words); $i++) {
                            $currentWord = $words[$i]->name;
                            for ($j = 0; $j < count($words); $j++) {
                                if (($i != $j) && (strcasecmp($currentWord, $words[$j]->name) == 0)) {
                                    if (!in_array(strtolower($currentWord), $wrongWords)) {
                                        array_push($wrongWords, strtolower($currentWord));
                                    }
                                }
                            }
                        }

                        if ((empty($wrongWords))) {
                            $category = new Category;
                            $category->name = strtoupper($request->name);
                            $category->creator_id = $request->session()->get('userId');
                            $category->privacy = $privacy;
                            $category->save();
                            $categoryAdded = $category;

                            for ($i = 0; $i < count($words); $i++) {
                                $word = new Word;
                                $word->name = $words[$i]->name;
                                $word->description = $words[$i]->description;
                                $word->category_id = $categoryAdded->id;
                                $word->save();
                            }

                            $sendCategory = (object)
                            [
                                "valid" => true,
                                'category' => $category,
                            ];
                        } else {
                            $sendCategory = (object)
                            [
                                "valid" => false,
                                'message' => 'One or more words are repeated.',
                                'wrongWords' => $wrongWords,
                            ];
                        }
                    } else {
                        $sendCategory = (object)
                        [
                            "valid" => false,
                            'message' => 'Words should be more than 3 characters and less than 20.',
                            'wrongWords' => $invalidWords,
                        ];
                    }
                }
            } else {
                $sendCategory = (object)
                [
                    "valid" => false,
                    'message' => "Category already exists."
                ];
            }
            } else {
                $sendCategory = (object)
                [
                    "valid" => false,
                    'message' => 'User is not logged in.',
                ];
            }


        }

        return response()->json($sendCategory);
    }

    public function getCategories(Request $request)
    {
        $getDefault = [];
        $getPublic = [];
        $getMine = [];
        $allDefaultCategories = [];
        $allPublicCategories = [];
        $allMyCategories = [];
        $categories = (object) ['default' => [], 'public' => [], 'myCategories' => []];

        //Check if user is logged
        $userId = $this->checkUserLogged($request);

        if ($userId != null) {
            //Get all categories where the user is the creator.
            $getMine = Category::where('creator_id', $userId)->get();
            $creatorName = User::where('id', $request->session()->get('userId'))->first();
            for ($i = 0; $i < count($getMine); $i++) {
                $numberWords = Word::where('category_id', $getMine[$i]->id)->count();
                $words = Word::where('category_id', $getMine[$i]->id)->get();
                $category = (object)
                [
                    'categoryId' => $getMine[$i]->id,
                    'categoryName' => $getMine[$i]->name,
                    'numberOfWords' => $numberWords,
                    'words' => $words,
                    'createdBy' => $creatorName,
                    'createdAt' => $getMine[$i]->created_at->format('d/m/Y')
                ];
                $allMyCategories[$i] = $category;
            }
        }

        //Always get default categories.
        $getDefault = Category::where('privacy', 'public')
            ->where('creator_id', NULL)
            ->get();
        $creatorName = "SYSTEM";
        for ($i = 0; $i < count($getDefault); $i++) {
            $numberWords = Word::where('category_id', $getDefault[$i]->id)->count();
            $words = Word::where('category_id', $getDefault[$i]->id)->get();
            $category = (object)
            [
                'categoryId' => $getDefault[$i]->id,
                'categoryName' => $getDefault[$i]->name,
                'numberOfWords' => $numberWords,
                'words' => $words,
                'createdBy' => $creatorName,
                'createdAt' => $getDefault[$i]->created_at->format('d/m/Y')
            ];
            $allDefaultCategories[$i] = $category;
        }

        //Always get categories created by other users.
        $getPublic = Category::where('privacy', 'public')
            ->where('creator_id', "!=", NULL)
            ->get();
        for ($i = 0; $i < count($getPublic); $i++) {
            $numberWords = Word::where('category_id', $getPublic[$i]->id)->count();
            $words = Word::where('category_id', $getPublic[$i]->id)->get();
            $creatorName = User::where('id', $getPublic[$i]->creator_id)->first();
            $category = (object)
            [
                'categoryId' => $getPublic[$i]->id,
                'categoryName' => $getPublic[$i]->name,
                'numberOfWords' => $numberWords,
                'words' => $words,
                'createdBy' => $creatorName,
                'createdAt' => $getPublic[$i]->created_at->format('d/m/Y')
            ];
            $allPublicCategories[$i] = $category;
        }

        $categories->default = $allDefaultCategories;
        $categories->public = $allPublicCategories;
        $categories->myCategories = $allMyCategories;

        return response()->json($categories);
    }

    //Get my categories
    public function getMyCategories(Request $request)
    {
        $categories = [];

        $returnCategories = (object)
        [
            "valid" => true,
            'message' => "You haven't created any categories yet!",
            'categories' => $categories
        ];

        //Check if user is logged
        $userId = $this->checkUserLogged($request);

        //If the user is logged be return all his private categories.
        if ($userId != null) {
            $getCategories = Category::where('creator_id', $userId)->get();
            $creatorName = User::where('id', $request->session()->get('userId'))->first();
            for ($i = 0; $i < count($getCategories); $i++) {
                $numberWords = Word::where('category_id', $getCategories[$i]->id)->count();
                $words = Word::where('category_id', $getCategories[$i]->id)->get();
                $category = (object)
                [
                    'categoryId' => $getCategories[$i]->id,
                    'categoryName' => $getCategories[$i]->name,
                    'numberOfWords' => $numberWords,
                    'words' => $words,
                    'privacy' => $getCategories[$i]->privacy,
                    'createdAt' => $getCategories[$i]->created_at->format('d/m/Y')
                ];
                $categories[$i] = $category;
            }

            //Return all my categories.
            if (count($categories) > 0) {
                $returnCategories = (object)
                [
                    "valid" => true,
                    'categories' => $categories
                ];
            }
        } else {
            $returnCategories = (object)
            [
                "valid" => false,
                'message' => "User is not logged in.",
            ];
        }

        return response()->json($categories);
    }

    //Edit the category
    public function editCategory(Request $request)
    {
        $wrongWords = [];
        $invalidWords = [];
        $categoryEdited = (object)[];
        $editCategory = false;

        //Check if the user is logged in.
        $userId = $this->checkUserLogged($request);

        if ($userId != null) {
            //Check if the category exists.
            $doesCategoryExist = Category::where('id', $request->category_id)
                ->count();

            //If the category exists check if the owner of the category is the user.
            if ($doesCategoryExist != 0) {
                $isTheUserTheOwner = Category::where('id', $request->category_id)
                    ->where('creator_id', $userId)
                    ->count();
                if ($isTheUserTheOwner != 0) {
                    //Set privacy
                    $privacy = 'private';
                    if ($request->public == "true") {
                        $privacy = 'public';
                    }

                    //Validate 
                    $validator =  Validator::make($request->all(), [
                        'name' => 'required|min:3|max:20',
                    ]);

                    if ($validator->fails()) {
                        $sendCategory = (object)
                        [
                            "valid" => false,
                            'message' => "The category name should be at least 3 characters long with a maximum of 20."
                        ];
                    } else {
                        //Check if the name is duplicated
                        $editCategoryName = true;
                        $editCategory = $this->checkCategoryDuplicated($request, $privacy, $editCategoryName);

                        //If we can edit the category we add it with the user id after checking that all the words are valid.
                        if ($editCategory) {
                            $allWordsAreValid = true;
                            $words = (json_decode($request->words));

                            if (count($words) < 3 || count($words) > 100) {
                                $sendCategory = (object)
                                [
                                    "valid" => false,
                                    'message' => 'There should be at least 3 words in the category, with a maximum of 100.',
                                ];
                            } else {
                                //Check that each word is valid.
                                $words = (json_decode($request->words));
                                for ($i = 0; $i < count($words); $i++) {
                                    $currentWord = $words[$i]->name;
                                    if (strlen($currentWord) < 3 || strlen($currentWord) > 20) {
                                        if (!in_array(strtolower($currentWord), $invalidWords)) {
                                            array_push($invalidWords, strtolower($currentWord));
                                            $allWordsAreValid = false;
                                        }
                                    }
                                }

                                if ($allWordsAreValid) {
                                    //Check for each word if it already exists.
                                    for ($i = 0; $i < count($words); $i++) {
                                        $currentWord = $words[$i]->name;
                                        for ($j = 0; $j < count($words); $j++) {
                                            if (($i != $j) && (strcasecmp($currentWord, $words[$j]->name) == 0)) {
                                                if (!in_array(strtolower($currentWord), $wrongWords)) {
                                                    array_push($wrongWords, strtolower($currentWord));
                                                }
                                            }
                                        }
                                    }

                                    if ((empty($wrongWords))) {
                                        //Delete all the words from this category
                                        Word::where('category_id', $request->category_id)->delete();

                                        $category = Category::where('id', $request->category_id)
                                            ->where('creator_id', $userId)
                                            ->first();
                                        $category->name = strtoupper($request->name);
                                        $category->privacy = $privacy;
                                        $category->save();
                                        $categoryEdited = $category;

                                        for ($i = 0; $i < count($words); $i++) {
                                            $word = new Word;
                                            $word->name = $words[$i]->name;
                                            $word->description = $words[$i]->description;
                                            $word->category_id = $categoryEdited->id;
                                            $word->save();
                                        }

                                        $sendCategory = (object)
                                        [
                                            "valid" => true,
                                            'message' => $category,
                                        ];
                                    } else {
                                        $sendCategory = (object)
                                        [
                                            "valid" => false,
                                            'message' => 'One or more words are repeated.',
                                            'wrongWords' => $wrongWords,
                                        ];
                                    }
                                } else {
                                    $sendCategory = (object)
                                    [
                                        "valid" => false,
                                        'message' => 'Words should be more than 3 characters and less than 20.',
                                        'wrongWords' => $invalidWords,
                                    ];
                                }
                            }
                        } else {
                            $sendCategory = (object)
                            [
                                "valid" => false,
                                'message' => "Category already exists."
                            ];
                        }
                    }
                } else {
                    $sendCategory = (object)
                    [
                        "valid" => false,
                        'message' => "You can't edit a category that isn't yours!",
                    ];
                }
            } else {
                $sendCategory = (object)
                [
                    "valid" => false,
                    'message' => "Category doesn't exist.",
                ];
            }
        } else {
            $sendCategory = (object)
            [
                "valid" => false,
                'message' => "User is not logged in.",
            ];
        }


        return response()->json($sendCategory);
    }

    //Delete the category
    public function deleteCategory(Request $request)
    {
        $userId = $this->checkUserLogged($request);

        //If the user is logged in.
        if ($userId != null) {

            //Check if the category exists.
            $doesCategoryExist = Category::where('id', $request->category_id)
                ->count();

            if ($doesCategoryExist != 0) {
                //If the category exists check if the user is the owner
                $isTheUserTheOwner = Category::where('id', $request->category_id)
                    ->where('creator_id', $userId)
                    ->count();

                if ($isTheUserTheOwner != 0) {
                    $getCategory = Category::where('id', $request->category_id)
                        ->where('creator_id', $userId)
                        ->first();
                    $categoryName = $getCategory->name;
                    Category::where('id', $request->category_id)
                        ->where('creator_id', $userId)
                        ->delete();
                    $deleted = (object)
                    [
                        "valid" => true,
                        'message' => "Category " . $categoryName . " deleted."
                    ];
                } else {
                    $deleted = (object)
                    [
                        "valid" => false,
                        'message' => "You can't delete a category that isn't yours!",
                    ];
                }
            } else {
                $deleted = (object)
                [
                    "valid" => false,
                    'message' => "Category doesn't exist.",
                ];
            }
        } else {
            //If the user is not logged in.
            $deleted = (object)
            [
                "valid" => false,
                'message' => "User is not logged in."
            ];
        }

        return response()->json($deleted);
    }
}
