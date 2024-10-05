import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"

export const createCategoryController = async (req, res) => {
    try {

        const { name } = req.body
        if (!name) {
            return res.status(401).send({
                success: false,
                message: 'Name is required'
            })
        }
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category already exists'
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: 'Category created successfully',
            category
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating category'
        })
    }
}


//Update Category Controller
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating category'
        })
    }
}


//Get all actegories
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: 'Categories retrieved successfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting categories'
        })
    }
}

// Get all categories
// export const categoryController = async (req, res) => {
//     try {
//         // Set Cache-Control header to prevent caching
//         res.set('Cache-Control', 'no-store');

//         const categories = await categoryModel.find({});
//         res.status(200).send({
//             success: true,
//             message: 'Categories retrieved successfully',
//             categories
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             error,
//             message: 'Error in getting categories'
//         });
//     }
// };


//Single Category
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({
            slug: req.params.slug
        })
        res.status(200).send({
            success: true,
            message: 'Category retrieved successfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting single category'
        })
    }
}


//delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in deleting category'
        })
    }
}