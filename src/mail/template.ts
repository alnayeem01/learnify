interface Options{
    title: string;
    message : string;
    link : string;
    logo : string;
    banner : string;
    btnTitle : string;
}

export const generateTemplate = (options: Options) => {
    const { title, message, link, logo, banner, btnTitle } = options;
    return `
      <!DOCTYPE html>
      <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
        <title>${title}</title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <!--[if mso]>
        <xml>
          <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
            <w:DontUseAdvancedTypographyReadingMail/>
          </w:WordDocument>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            <o:AllowPNG/>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <style>
          /* Your styles here */
        </style>
        <!--[if mso]>
        <style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style>
        <![endif]-->
      </head>
      <body class="body" style="background-color: #fff0e3; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="background-color: #fff0e3;" width="100%">
          <tbody>
            <tr>
              <td>
                <!-- Header Section -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="width: 680px; margin: 0 auto;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-2" width="33.333333333333336%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" width="100%">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                      <div align="center" class="alignment">
                                        <div style="max-width: 147.333px;">
                                          <img alt="Company Logo" height="auto" src="${logo}" style="display: block; height: auto; border: 0; width: 100%;" title="Company Logo"/>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- Banner Section -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="width: 680px; margin: 0 auto;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%">
                                <table border="0" cellpadding="15" cellspacing="0" class="image_block block-1" role="presentation" width="100%">
                                  <tr>
                                    <td class="pad">
                                      <div align="center" class="alignment">
                                        <div style="max-width: 374px;">
                                          <img alt="Banner" height="auto" src="${banner}" style="display: block; height: auto; border: 0; width: 100%;" title="Banner"/>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:35px;line-height:35px;font-size:1px;"> </div>
                                <!-- Dynamic Title -->
                                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" width="100%">
                                  <tr>
                                    <td class="pad" style="text-align:center;width:100%;">
                                      <h1 style="margin: 0; color: #101010; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 27px; line-height: 1.2;">
                                        <strong>${title}</strong>
                                      </h1>
                                    </td>
                                  </tr>
                                </table>
                                <!-- Dynamic Message -->
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" width="100%">
                                  <tr>
                                    <td class="pad" style="padding:10px 20px 10px 20px;">
                                      <div style="color:#848484;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:1.8;text-align:center;">
                                        <p style="margin: 0;">${message}</p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <!-- Reset Button -->
                                <table border="0" cellpadding="10" cellspacing="0" class="button_block block-3" role="presentation" width="100%">
                                  <tr>
                                    <td class="pad">
                                      <div align="center" class="alignment">
                                        <a href="${link}" style="background-color: #101; border-radius: 4px; color: #ffffff; display: inline-block; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 16px; text-decoration: none; padding: 5px 20px;" target="_blank">
                                          <span style="line-height: 32px;">${btnTitle}</span>
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <div class="spacer_block block-4" style="height:20px;line-height:20px;font-size:1px;"> </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- Footer Section (optional) -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="width: 680px; margin: 0 auto;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" style="text-align:center;" width="100%">
                                <p style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;color:#101010;">© Learnify</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;
  }
  