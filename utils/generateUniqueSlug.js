const generateUniqueSlug = async (baseSlug, model) => {
    let slug = baseSlug;
    let counter = 1;

    while (await model.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};


const generateUniqueSlugForUpdate = async (baseSlug,model, currentId) => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await model.findOne({ slug });
        if (!existing || existing._id.toString() === currentId) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};
module.exports= {generateUniqueSlug,generateUniqueSlugForUpdate};