const friendlyUrl = (url) => {
  return url.toLowerCase()
           .replace(/[áàãảạăắằẳẵặâấầẩẫậÁÀÃẢẠĂẮẰẲẴẶÂẤẦẨẪẬ]/g, 'a')
           .replace(/[đĐ]/g, 'd')
           .replace(/[éèẻẽẹêếềểễệÉÈẺẼẸÊẾỀỂỄỆ]/g, 'e')
           .replace(/[íìỉĩịÍÌỈĨỊ]/g, 'i')
           .replace(/[ôốồổỗộơớờởỡợóòõỏọÔỐỒỔỖỘƠỚỜỞỠỢÓÒÕỎỌ]/g, 'o')
           .replace(/[ưứừửữựúùủũụƯỨỪỬỮỰÚÙỦŨỤ]/g, 'u')
           .replace(/[ýỳỷỹỵÝỲỶỸỴ]/g, 'u')
           .replace(/\s+/g, '-')
           .replace(/[^a-z0-9\-]/g, '')
           .replace(/\-{2,}/g, '-')
           .replace(/(^\s*)|(\s*$)/g, '');
};

export default friendlyUrl;