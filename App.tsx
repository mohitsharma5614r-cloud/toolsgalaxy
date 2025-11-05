import React, { useState, useMemo, useCallback } from 'react';

// Layout
import { Header } from './components/Header';
import { Breadcrumb } from './components/Breadcrumb';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { ToolPlaceholder } from './components/ToolPlaceholder';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';


// Data
import { toolData } from './data/tools';

// All Tool Components
import { AiImageEditor } from './components/tools/AiImageEditor';
import { CaseConverter } from './components/tools/CaseConverter';
import { ColorPaletteExtractor } from './components/tools/ColorPaletteExtractor';
import { StartupNameMixer } from './components/tools/StartupNameMixer';
import { VoiceRecorder } from './components/tools/VoiceRecorder';
import { AiCrushPredictor } from './components/tools/AiCrushPredictor';
import { AiFutureJobFinder } from './components/tools/AiFutureJobFinder';
import { AiMoodDetector } from './components/tools/AiMoodDetector';
import { AiBioCaptionMaker } from './components/tools/AiBioCaptionMaker';
import { AiPetNameGenerator } from './components/tools/AiPetNameGenerator';
import { AiFriendCompatibility } from './components/tools/AiFriendCompatibility';
import { AiArticleWriter } from './components/tools/AiArticleWriter';
import { AiPresentationMaker } from './components/tools/AiPresentationMaker';
import { AiIdeaGenerator } from './components/tools/AiIdeaGenerator';
import { AiResumeGenerator } from './components/tools/AiResumeGenerator';
import { AiThumbnailBannerGenerator } from './components/tools/AiThumbnailBannerGenerator';
import { TypingSpeedTest } from './components/tools/TypingSpeedTest';
import { QuizCreator } from './components/tools/QuizCreator';
import { NotesOrganizer } from './components/tools/NotesOrganizer';
import { VocabularyTrainer } from './components/tools/VocabularyTrainer';
import { EssayOutlineGenerator } from './components/tools/EssayOutlineGenerator';
import { TextHighlighter } from './components/tools/TextHighlighter';
import { MindMapMaker } from './components/tools/MindMapMaker';
import { BrandNameFinder } from './components/tools/BrandNameFinder';
import { SloganCreator } from './components/tools/SloganCreator';
import { ScientificCalculator } from './components/tools/ScientificCalculator';
import { EquationSolver } from './components/tools/EquationSolver';
import { PeriodicTableExplorer } from './components/tools/PeriodicTableExplorer';
import { GeometryDiagramMaker } from './components/tools/GeometryDiagramMaker';
import { MathWorksheetGenerator } from './components/tools/MathWorksheetGenerator';
import { ChemistryEquationBalancer } from './components/tools/ChemistryEquationBalancer';
import { PhysicsFormulaFinder } from './components/tools/PhysicsFormulaFinder';
import { MotivationQuoteWidget } from './components/tools/MotivationQuoteWidget';
import { ConceptMapGenerator } from './components/tools/ConceptMapGenerator';
import { DailyChallengeGenerator } from './components/tools/DailyChallengeGenerator';
import { CrosswordMaker } from './components/tools/CrosswordMaker';
import { LessonPlanMaker } from './components/tools/LessonPlanMaker';
import { StudentFeedbackFormBuilder } from './components/tools/StudentFeedbackFormBuilder';
import { InstaHashtagFinder } from './components/tools/InstaHashtagFinder';
import { AiAgePredictor } from './components/tools/AiAgePredictor';
import { FaceSymmetryChecker } from './components/tools/FaceSymmetryChecker';
import { CartoonFaceGenerator } from './components/tools/CartoonFaceGenerator';
import { OldAgeFilter } from './components/tools/OldAgeFilter';
import { BabyFacePredictor } from './components/tools/BabyFacePredictor';
import { FutureFaceGenerator } from './components/tools/FutureFaceGenerator';
import { CelebrityLookAlikeFinder } from './components/tools/CelebrityLookAlikeFinder';
import { QuoteMaker } from './components/tools/QuoteMaker';
import { YouTubeThumbnailCaptionMaker } from './components/tools/YouTubeThumbnailCaptionMaker';
import { ReelHookLineCreator } from './components/tools/ReelHookLineCreator';
import { TrendTracker } from './components/tools/TrendTracker';
import { BioEmojiStyler } from './components/tools/BioEmojiStyler';
import { YouTubeVideoIdeaGenerator } from './components/tools/YouTubeVideoIdeaGenerator';
import { StoryPlotGenerator } from './components/tools/StoryPlotGenerator';
import { PoemCreator } from './components/tools/PoemCreator';
import { SongLyricsMaker } from './components/tools/SongLyricsMaker';
import { ProductDescriptionWriter } from './components/tools/ProductDescriptionWriter';
import { ArticleSummarizer } from './components/tools/ArticleSummarizer';
import { ParagraphRewriter } from './components/tools/ParagraphRewriter';
import { EssayExpander } from './components/tools/EssayExpander';
import { BookTitleGenerator } from './components/tools/BookTitleGenerator';
import { NewsletterNameGenerator } from './components/tools/NewsletterNameGenerator';
import { JokeGenerator } from './components/tools/JokeGenerator';
import { TweetIdeaMaker } from './components/tools/TweetIdeaMaker';
import { CommentGenerator } from './components/tools/CommentGenerator';
import { KeywordIdeaGenerator } from './components/tools/KeywordIdeaGenerator';
import { HeadlineAnalyzer } from './components/tools/HeadlineAnalyzer';
import { AdCopyGenerator } from './components/tools/AdCopyGenerator';
import { BlogIntroMaker } from './components/tools/BlogIntroMaker';
import { BlogOutroMaker } from './components/tools/BlogOutroMaker';
import { ShortStoryGenerator } from './components/tools/ShortStoryGenerator';
import { RecipeWriter } from './components/tools/RecipeWriter';
import { TestPaperGenerator } from './components/tools/TestPaperGenerator';
import { StudentReportCardGenerator } from './components/tools/StudentReportCardGenerator';
import { CreditScoreImprovementPlanner } from './components/tools/CreditScoreImprovementPlanner';
import { CreditCardChecker } from './components/tools/CreditCardChecker';
import { InvestmentRiskAnalyzer } from './components/tools/InvestmentRiskAnalyzer';
import { LoanEligibilityCalculator } from './components/tools/LoanEligibilityCalculator';
import { LoanEmiPlanner } from './components/tools/LoanEmiPlanner';
import { BusinessLoanComparison } from './components/tools/BusinessLoanComparison';
import { PersonalLoanCalculator } from './components/tools/PersonalLoanCalculator';
import { HomeLoanAffordabilityTool } from './components/tools/HomeLoanAffordabilityTool';
import { DebtToIncomeRatioCalculator } from './components/tools/DebtToIncomeRatioCalculator';
import { SipCalculator } from './components/tools/SipCalculator';
import { MutualFundReturnEstimator } from './components/tools/MutualFundReturnEstimator';
import { StockTaxCalculator } from './components/tools/StockTaxCalculator';
import { CapitalGainsTaxCalculator } from './components/tools/CapitalGainsTaxCalculator';
import { IntradayBreakevenCalculator } from './components/tools/IntradayBreakevenCalculator';
import { GstCalculator } from './components/tools/GstCalculator';
import { GstReverseChargeTool } from './components/tools/GstReverseChargeTool';
import { InsuranceCoverageSuggestor } from './components/tools/InsuranceCoverageSuggestor';
import { TermInsuranceNeedEstimator } from './components/tools/TermInsuranceNeedEstimator';
import { HealthInsurancePlanner } from './components/tools/HealthInsurancePlanner';
import { TravelInsuranceCoverageChecker } from './components/tools/TravelInsuranceCoverageChecker';
import { ChildEducationCostCalculator } from './components/tools/ChildEducationCostCalculator';
import { WealthAccumulationPlanner } from './components/tools/WealthAccumulationPlanner';
import { InflationImpactCalculator } from './components/tools/InflationImpactCalculator';
import { SavingsGrowthCalculator } from './components/tools/SavingsGrowthCalculator';
import { FixedDepositCalculator } from './components/tools/FixedDepositCalculator';
import { RecurringDepositCalculator } from './components/tools/RecurringDepositCalculator';
import { CompoundInterestVisualizer } from './components/tools/CompoundInterestVisualizer';
import { IncomeTaxBracketChecker } from './components/tools/IncomeTaxBracketChecker';
import { Section80cTaxSavingsPlanner } from './components/tools/Section80cTaxSavingsPlanner';
import { TdsCalculator } from './components/tools/TdsCalculator';
import { SalaryBreakdownTool } from './components/tools/SalaryBreakdownTool';
import { NriTaxCalculator } from './components/tools/NriTaxCalculator';
import { InternationalSalaryConverter } from './components/tools/InternationalSalaryConverter';
import { PropertyLoanEligibilityTool } from './components/tools/PropertyLoanEligibilityTool';
import { RentVsBuyCalculator } from './components/tools/RentVsBuyCalculator';
import { HomeLoanBalanceTransferBenefitTool } from './components/tools/HomeLoanBalanceTransferBenefitTool';
import { ImportCustomDutyCalculator } from './components/tools/ImportCustomDutyCalculator';
import { ImportCostEstimator } from './components/tools/ImportCostEstimator';
import { GoldInvestmentReturnCalculator } from './components/tools/GoldInvestmentReturnCalculator';
import { PpfCalculator } from './components/tools/PpfCalculator';
import { NpsCalculator } from './components/tools/NpsCalculator';
import { CarLoanEmiTool } from './components/tools/CarLoanEmiTool';
import { BikeLoanCalculator } from './components/tools/BikeLoanCalculator';
import { LuxuryTaxCalculator } from './components/tools/LuxuryTaxCalculator';
import { PersonalBudgetPlanner } from './components/tools/PersonalBudgetPlanner';
import { AnnualExpenseBreakdownTool } from './components/tools/AnnualExpenseBreakdownTool';
import { MergeSplitCompressPdf } from './components/tools/MergeSplitCompressPdf';
import { WordToPdf } from './components/tools/WordToPdf';
import { PdfToWord } from './components/tools/PdfToWord';
import { ImageToPdf } from './components/tools/ImageToPdf';
import { EsignPdf } from './components/tools/EsignPdf';
import { Ocr } from './components/tools/Ocr';
import { PdfToPpt } from './components/tools/PdfToPpt';
import { PptToPdf } from './components/tools/PptToPdf';
import { PdfMergeTool } from './components/tools/PdfMergeTool';
import { PdfSplitTool } from './components/tools/PdfSplitTool';
import { PdfCompressor } from './components/tools/PdfCompressor';
import { PdfUnlocker } from './components/tools/PdfUnlocker';
import { PdfLocker } from './components/tools/PdfLocker';
import { PdfPageRemover } from './components/tools/PdfPageRemover';
import { PdfPageRotator } from './components/tools/PdfPageRotator';
import { PdfToExcelConverter } from './components/tools/PdfToExcelConverter';
import { TextToPdfConverter } from './components/tools/TextToPdfConverter';
import { PdfPageExtractor } from './components/tools/PdfPageExtractor';
import { PdfPageRearranger } from './components/tools/PdfPageRearranger';
import { PdfCropTool } from './components/tools/PdfCropTool';
import { PdfPageSizeChanger } from './components/tools/PdfPageSizeChanger';
import { PdfPasswordGenerator } from './components/tools/PdfPasswordGenerator';
import { PdfHeaderFooterAdder } from './components/tools/PdfHeaderFooterAdder';
import { PdfBackgroundRemover } from './components/tools/PdfBackgroundRemover';
import { PdfToHtmlConverter } from './components/tools/PdfToHtmlConverter';
import { HtmlToPdfConverter } from './components/tools/HtmlToPdfConverter';
import { PdfToCsvConverter } from './components/tools/PdfToCsvConverter';
import { CsvToPdfConverter } from './components/tools/CsvToPdfConverter';
import { CsvToJsonConverter } from './components/tools/CsvToJsonConverter';
import { PdfFileMergerDragDrop } from './components/tools/PdfFileMergerDragDrop';
import { BatchPdfToImageConverter } from './components/tools/BatchPdfToImageConverter';
import { BatchDocToPdfConverter } from './components/tools/BatchDocToPdfConverter';
import { PdfCompareTool } from './components/tools/PdfCompareTool';
import { DocumentTranslator } from './components/tools/DocumentTranslator';
import { ResumeToPdfFormatter } from './components/tools/ResumeToPdfFormatter';
import { InvoiceToPdfGenerator } from './components/tools/InvoiceToPdfGenerator';
import { PdfCertificateMaker } from './components/tools/PdfCertificateMaker';
import { PageToImageSnapshotTool } from './components/tools/PageToImageSnapshotTool';
import { DocumentToZipConverter } from './components/tools/DocumentToZipConverter';
import { ReadablePdfTextViewer } from './components/tools/ReadablePdfTextViewer';
import { ExtractTablesFromPdf } from './components/tools/ExtractTablesFromPdf';
import { PdfWatermarkRemover } from './components/tools/PdfWatermarkRemover';
import { PdfHighlightRemover } from './components/tools/PdfHighlightRemover';
import { PdfRedactTool } from './components/tools/PdfRedactTool';
import { PdfAnnotationEditor } from './components/tools/PdfAnnotationEditor';
import { PdfBookmarkManager } from './components/tools/PdfBookmarkManager';
import { PdfCommentExtractor } from './components/tools/PdfCommentExtractor';
import { PdfSignatureValidator } from './components/tools/PdfSignatureValidator';
import { ScannedPdfToSearchablePdf } from './components/tools/ScannedPdfToSearchablePdf';
import { PdfFileRenamer } from './components/tools/PdfFileRenamer';
import { PdfMergeByFolder } from './components/tools/PdfMergeByFolder';
import { PageNumberRemover } from './components/tools/PageNumberRemover';
import { ResumeToPdfDesigner } from './components/tools/ResumeToPdfDesigner';
import { CoverLetterFormatter } from './components/tools/CoverLetterFormatter';
import { LegalDocumentFormatter } from './components/tools/LegalDocumentFormatter';
import { ContractTemplateGenerator } from './components/tools/ContractTemplateGenerator';
import { PageByPagePdfViewer } from './components/tools/PageByPagePdfViewer';
import { PdfToZipCompressor } from './components/tools/PdfToZipCompressor';
import { PdfEncryptDecryptTool } from './components/tools/PdfEncryptDecryptTool';
import { PdfRotateByDegree } from './components/tools/PdfRotateByDegree';
import { DarkHumorGenerator } from './components/tools/DarkHumorGenerator';
import { DadJokeCreator } from './components/tools/DadJokeCreator';
import { FunnyQuoteGenerator } from './components/tools/FunnyQuoteGenerator';
import { RoastMeGenerator } from './components/tools/RoastMeGenerator';
import { MemeCaptionGenerator } from './components/tools/MemeCaptionGenerator';
import { TwitterPostMemeMaker } from './components/tools/TwitterPostMemeMaker';
import { InstagramPostCaptionGenerator } from './components/tools/InstagramPostCaptionGenerator';
import { FakeChatMaker } from './components/tools/FakeChatMaker';
import { FakeNewsHeadlineCreator } from './components/tools/FakeNewsHeadlineCreator';
import { RandomRumorGenerator } from './components/tools/RandomRumorGenerator';
import { ScreenshotPrankCreator } from './components/tools/ScreenshotPrankCreator';
import { RandomStoryStarter } from './components/tools/RandomStoryStarter';
import { WhatIfScenarioGenerator } from './components/tools/WhatIfScenarioGenerator';
import { IQCalculator } from './components/tools/IQCalculator';
import { AttractivenessMeter } from './components/tools/AttractivenessMeter';
import { HowOldDoYouLookMeter } from './components/tools/HowOldDoYouLookMeter';
import { GenderGuesser } from './components/tools/GenderGuesser';
import { TattooDesignIdeaGenerator } from './components/tools/TattooDesignIdeaGenerator';
import { UsernameCreator } from './components/tools/UsernameCreator';
import { SignatureStyleCreator } from './components/tools/SignatureStyleCreator';
import { WallpaperMaker } from './components/tools/WallpaperMaker';
import { LogoGenerator } from './components/tools/LogoGenerator';
import { FakeIdentityGenerator } from './components/tools/FakeIdentityGenerator';
import { PixelArtMaker } from './components/tools/PixelArtMaker';
import { CartoonifyTool } from './components/tools/CartoonifyTool';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { ImageCompressor } from './components/tools/ImageCompressor';
import { ConvertImage } from './components/tools/ConvertImage';
import { ImageBrightnessEditor } from './components/tools/ImageBrightnessEditor';
import { ImageContrastEditor } from './components/tools/ImageContrastEditor';
import { ImageSharpenTool } from './components/tools/ImageSharpenTool';
import { RedEyeRemover } from './components/tools/RedEyeRemover';
import { ObjectEraser } from './components/tools/ObjectEraser';
import { ProfilePictureMaker } from './components/tools/ProfilePictureMaker';
import { MovieDialogueGenerator } from './components/tools/MovieDialogueGenerator';
import { ComplimentMaker } from './components/tools/ComplimentMaker';
import { DreamMeaningInterpreter } from './components/tools/DreamMeaningInterpreter';
import { LifeAdviceGenerator } from './components/tools/LifeAdviceGenerator';
import { LuckyNumberGenerator } from './components/tools/LuckyNumberGenerator';
import { ZodiacCompatibilityFinder } from './components/tools/ZodiacCompatibilityFinder';
import { HoroscopeGenerator } from './components/tools/HoroscopeGenerator';
import { DailyAffirmationGenerator } from './components/tools/DailyAffirmationGenerator';
import { LifeGoalPlanner } from './components/tools/LifeGoalPlanner';
import { PersonalityTest } from './components/tools/PersonalityTest';
import { InnovationScoreCalculator } from './components/tools/InnovationScoreCalculator';
import { RiskAnalyzer } from './components/tools/RiskAnalyzer';
import { BrainstormBoardTool } from './components/tools/BrainstormBoardTool';
import { DocumentReadingTimeCalculator } from './components/tools/DocumentReadingTimeCalculator';
import { FlashcardMaker } from './components/tools/FlashcardMaker';
import { SalesPitchGenerator } from './components/tools/SalesPitchGenerator';
import { LoveLetterWriter } from './components/tools/LoveLetterWriter';
import { IpAddressFinder } from './components/tools/IpAddressFinder';
import { BusinessValuationCalculator } from './components/tools/BusinessValuationCalculator';
import { BurnRateCalculator } from './components/tools/BurnRateCalculator';
import { RunwayCalculator } from './components/tools/RunwayCalculator';
import { ProfitMarginCalculator } from './components/tools/ProfitMarginCalculator';
import { ProductPricingCalculator } from './components/tools/ProductPricingCalculator';
import { BreakEvenPointCalculator } from './components/tools/BreakEvenPointCalculator';
import { WholesaleVsRetailProfitTool } from './components/tools/WholesaleVsRetailProfitTool';
import { EmployeeSalaryCostTool } from './components/tools/EmployeeSalaryCostTool';
import { BusinessPlanGenerator } from './components/tools/BusinessPlanGenerator';
import { InvestorPitchGenerator } from './components/tools/InvestorPitchGenerator';
import { BrandSloganGenerator } from './components/tools/BrandSloganGenerator';


// Newly implemented tools
import { YouTubeThumbnailCreator } from './components/tools/YouTubeThumbnailCreator';
import { InstagramStoryCropTool } from './components/tools/InstagramStoryCropTool';
import { LinkedInBannerMaker } from './components/tools/LinkedInBannerMaker';
import { TwitterHeaderCropper } from './components/tools/TwitterHeaderCropper';
import { DiscordPfpMaker } from './components/tools/DiscordPfpMaker';
import { GlitchEffectCreator } from './components/tools/GlitchEffectCreator';
import { NoiseAdderRemover } from './components/tools/NoiseAdderRemover';
import { LensDistortionTool } from './components/tools/LensDistortionTool';
import { HalftoneEffectMaker } from './components/tools/HalftoneEffectMaker';
import { ImageDifferenceFinder } from './components/tools/ImageDifferenceFinder';
import { GifSplitter } from './components/tools/GifSplitter';
import { ImageHistogramViewer } from './components/tools/ImageHistogramViewer';
import { DuplicateImageFinder } from './components/tools/DuplicateImageFinder';
import { BatchImageExporter } from './components/tools/BatchImageExporter';
import { NotesToPdf } from './components/tools/NotesToPdf';
import { LetterheadTemplateCreator } from './components/tools/LetterheadTemplateCreator';
import { InvoicePdfAutoFiller } from './components/tools/InvoicePdfAutoFiller';
import { SmartMerge } from './components/tools/SmartMerge';
import { PageOrientationChanger } from './components/tools/PageOrientationChanger';
import { PdfToZipAutoOrganizer } from './components/tools/PdfToZipAutoOrganizer';
import { PdfToTxtBatchConverter } from './components/tools/PdfToTxtBatchConverter';
import { PdfSplitByBookmarks } from './components/tools/PdfSplitByBookmarks';
import { LogoOverlayTool } from './components/tools/LogoOverlayTool';

// Placeholder tools
import { PdfThumbnailPreviewGenerator } from './components/tools/PdfThumbnailPreviewGenerator';
import { PdfToEpubConverter } from './components/tools/PdfToEpubConverter';
import { EpubToPdfConverter } from './components/tools/EpubToPdfConverter';
import { WordToHtmlConverter } from './components/tools/WordToHtmlConverter';
import { HtmlToWordConverter } from './components/tools/HtmlToWordConverter';
import { PowerpointSlideMerger } from './components/tools/PowerpointSlideMerger';
import { DocxMetadataRemover } from './components/tools/DocxMetadataRemover';
import { PdfSizeReducerLossless } from './components/tools/PdfSizeReducerLossless';
import { PdfTextReplacer } from './components/tools/PdfTextReplacer';
import { PdfFontIdentifier } from './components/tools/PdfFontIdentifier';
import { PdfBorderAdder } from './components/tools/PdfBorderAdder';
import { PdfShadowEffectTool } from './components/tools/PdfShadowEffectTool';
import { PdfToBlackAndWhiteConverter } from './components/tools/PdfToBlackAndWhiteConverter';
import { PdfPageColorAdjuster } from './components/tools/PdfPageColorAdjuster';
import { PdfTransparencyEditor } from './components/tools/PdfTransparencyEditor';
import { PdfDpiEnhancer } from './components/tools/PdfDpiEnhancer';
import { PageMarginAdjuster } from './components/tools/PageMarginAdjuster';
import { ResumeToDocxConverter } from './components/tools/ResumeToDocxConverter';
import { TextFormatterForPdf } from './components/tools/TextFormatterForPdf';
import { DocumentWordCounter } from './components/tools/DocumentWordCounter';
import { PdfToMarkdownConverter } from './components/tools/PdfToMarkdownConverter';
import { MarkdownToPdfConverter } from './components/tools/MarkdownToPdfConverter';
import { TextExtractorFromDocx } from './components/tools/TextExtractorFromDocx';

// New Face & Style Tool Placeholders
import { AiFaceSwapTool } from './components/tools/AiFaceSwapTool';
import { AiGenderSwapPhotoMaker } from './components/tools/AiGenderSwapPhotoMaker';
import { AiAgeProgression } from './components/tools/AiAgeProgression';
import { AiAgeRegression } from './components/tools/AiAgeRegression';
import { AiHairstyleTryOnTool } from './components/tools/AiHairstyleTryOnTool';
import { AiBeardTryOnTool } from './components/tools/AiBeardTryOnTool';
import { AiMakeupGenerator } from './components/tools/AiMakeupGenerator';
import { AiFaceExpressionChanger } from './components/tools/AiFaceExpressionChanger';
import { AiPhotoToAnimeCartoon } from './components/tools/AiPhotoToAnimeCartoon';
import { AiHollywoodLookFilter } from './components/tools/AiHollywoodLookFilter';

// Newly added Business Tools
import { BusinessNameGenerator } from './components/tools/BusinessNameGenerator';
import { InvoiceMaker } from './components/tools/InvoiceMaker';
import { ExpenseTrackerTool } from './components/tools/ExpenseTrackerTool';
import { InventoryCalculator } from './components/tools/InventoryCalculator';
import { VendorComparisonTool } from './components/tools/VendorComparisonTool';
import { MarketResearchGenerator } from './components/tools/MarketResearchGenerator';
import { SWOTAnalyzer } from './components/tools/SWOTAnalyzer';
import { CompetitorAnalysisTool } from './components/tools/CompetitorAnalysisTool';
import { BusinessRiskScoreTool } from './components/tools/BusinessRiskScoreTool';
import { FranchiseCostEstimator } from './components/tools/FranchiseCostEstimator';
import { DigitalMarketingBudgetPlanner } from './components/tools/DigitalMarketingBudgetPlanner';
import { AdRoiCalculator } from './components/tools/AdRoiCalculator';
import { LtvCalculator } from './components/tools/LtvCalculator';
import { CacCalculator } from './components/tools/CacCalculator';
import { RecruitmentCostCalculator } from './components/tools/RecruitmentCostCalculator';
import { StartupGrowthPlanner } from './components/tools/StartupGrowthPlanner';
import { BusinessModelBuilder } from './components/tools/BusinessModelBuilder';
import { ProductivityScoreCalculator } from './components/tools/ProductivityScoreCalculator';
import { ResourceAllocationTool } from './components/tools/ResourceAllocationTool';
import { EmailResponseSuggestor } from './components/tools/EmailResponseSuggestor';
import { SalesFunnelBuilder } from './components/tools/SalesFunnelBuilder';
import { ClientProposalWriter } from './components/tools/ClientProposalWriter';
import { ProductLaunchPlanner } from './components/tools/ProductLaunchPlanner';
import { TeamPerformanceAnalyzer } from './components/tools/TeamPerformanceAnalyzer';
import { CustomerSatisfactionScoreTool } from './components/tools/CustomerSatisfactionScoreTool';
import { FeedbackAnalysisTool } from './components/tools/FeedbackAnalysisTool';
import { SalaryNegotiationCalculator } from './components/tools/SalaryNegotiationCalculator';
import { MarketingCalendarGenerator } from './components/tools/MarketingCalendarGenerator';
import { AgreementContractGenerator } from './components/tools/AgreementContractGenerator';
import { VendorPaymentScheduleTool } from './components/tools/VendorPaymentScheduleTool';
import { CustomerSegmentationTool } from './components/tools/CustomerSegmentationTool';
import { PriceTestingCalculator } from './components/tools/PriceTestingCalculator';
import { RetailProfitEstimator } from './components/tools/RetailProfitEstimator';
import { ShippingCostCalculator } from './components/tools/ShippingCostCalculator';
import { ProductivityTimeBlocker } from './components/tools/ProductivityTimeBlocker';
import { SubscriptionProfitCalculator } from './components/tools/SubscriptionProfitCalculator';
import { SaaSPricingCalculator } from './components/tools/SaaSPricingCalculator';
import { BusinessGrowthProjectionTool } from './components/tools/BusinessGrowthProjectionTool';
import { GoogleAdsBudgetEstimator } from './components/tools/GoogleAdsBudgetEstimator';
import { FacebookAdsBudgetTool } from './components/tools/FacebookAdsBudgetTool';
import { MarketingFunnelGenerator } from './components/tools/MarketingFunnelGenerator';
import { SeoKeywordClusterTool } from './components/tools/SeoKeywordClusterTool';
import { BacklinkAnalyzer } from './components/tools/BacklinkAnalyzer';
import { SerpChecker } from './components/tools/SerpChecker';
import { MetaDescriptionGenerator } from './components/tools/MetaDescriptionGenerator';
import { MarketingBlogTitleGenerator } from './components/tools/MarketingBlogTitleGenerator';
import { PpcRoiCalculator } from './components/tools/PpcRoiCalculator';
import { LandingPageAnalyzer } from './components/tools/LandingPageAnalyzer';
import { EmailSequenceGenerator } from './components/tools/EmailSequenceGenerator';
import { ColdEmailWriter } from './components/tools/ColdEmailWriter';
import { LeadMagnetGenerator } from './components/tools/LeadMagnetGenerator';
import { ContentCalendarGenerator } from './components/tools/ContentCalendarGenerator';
import { ConversionRateCalculator } from './components/tools/ConversionRateCalculator';
import { AbTestingPlanner } from './components/tools/AbTestingPlanner';
import { BrandStyleGuideGenerator } from './components/tools/BrandStyleGuideGenerator';
import { SocialMediaPostPlanner } from './components/tools/SocialMediaPostPlanner';
import { ViewerRetentionCalculator } from './components/tools/ViewerRetentionCalculator';
import { VideoWatchTimeCalculator } from './components/tools/VideoWatchTimeCalculator';
import { YouTubeTitleTagsGenerator } from './components/tools/YouTubeTitleTagsGenerator';
import { HashtagRankAnalyzer } from './components/tools/HashtagRankAnalyzer';
import { WebsiteHeatmapSimulator } from './components/tools/WebsiteHeatmapSimulator';

// New Marketing/SaaS Tools from user
import { RefundRateCalculator } from './components/tools/RefundRateCalculator';
import { CustomerSupportScriptWriter } from './components/tools/CustomerSupportScriptWriter';
import { AiAdCreativePlanner } from './components/tools/AiAdCreativePlanner';
import { BrandCompetitionAnalyzer } from './components/tools/BrandCompetitionAnalyzer';
import { MarketingKpiDashboard } from './components/tools/MarketingKpiDashboard';
import { WebinarFunnelPlanner } from './components/tools/WebinarFunnelPlanner';

// Newly added Language/Communication Tools
import { RhymingWordGenerator } from './components/tools/RhymingWordGenerator';
import { SentenceRephraser } from './components/tools/SentenceRephraser';
import { EnglishPronunciationHelper } from './components/tools/EnglishPronunciationHelper';
import { TextToIpaConverter } from './components/tools/TextToIpaConverter';
import { SpeechToTextTool } from './components/tools/SpeechToTextTool';
import { TextToSpeechTool } from './components/tools/TextToSpeechTool';
import { EmailTemplateGenerator } from './components/tools/EmailTemplateGenerator';
import { ResumeGrammarChecker } from './components/tools/ResumeGrammarChecker';

// Newly implemented Media Tools
import { VideoCompressor } from './components/tools/VideoCompressor';
import { ScreenRecorder } from './components/tools/ScreenRecorder';
import { AudioCutterJoiner } from './components/tools/AudioCutterJoiner';
import { SubtitleGenerator } from './components/tools/SubtitleGenerator';
import { InstagramReelsDownloader } from './components/tools/InstagramReelsDownloader';
import { TikTokDownloader } from './components/tools/TikTokDownloader';
import { YouTubeToMp4Converter } from './components/tools/YouTubeToMp4Converter';
import { AudioWatermarkDetector } from './components/tools/AudioWatermarkDetector';
import { AudioToMidiConverter } from './components/tools/AudioToMidiConverter';
import { VideoToMp3Cutter } from './components/tools/VideoToMp3Cutter';
import { YouTubeLiveStreamToAudio } from './components/tools/YouTubeLiveStreamToAudio';
import { AudioSpectrumVisualizer } from './components/tools/AudioSpectrumVisualizer';
import { VideoBackgroundRemover } from './components/tools/VideoBackgroundRemover';
import { VoiceToMusicConverter } from './components/tools/VoiceToMusicConverter';
import { VideoSubtitleRemover } from './components/tools/VideoSubtitleRemover';
import { VideoFormatDetector } from './components/tools/VideoFormatDetector';
import { VideoMetadataEditor } from './components/tools/VideoMetadataEditor';
import { DailyMotionDownloader } from './components/tools/DailyMotionDownloader';
import { RedditVideoDownloader } from './components/tools/RedditVideoDownloader';
import { PinterestVideoDownloader } from './components/tools/PinterestVideoDownloader';
import { TwitchClipDownloader } from './components/tools/TwitchClipDownloader';
import { MixCloudDownloader } from './components/tools/MixCloudDownloader';
import { SoundCloudDownloader } from './components/tools/SoundCloudDownloader';
import { SpotifyPlaylistConverter } from './components/tools/SpotifyPlaylistConverter';
import { RadioStreamRecorder } from './components/tools/RadioStreamRecorder';

// New Media tools
import { ScreenCapture } from './components/tools/ScreenCapture';
import { LiveStreamRecorder } from './components/tools/LiveStreamRecorder';
import { YouTubeCommentsDownloader } from './components/tools/YouTubeCommentsDownloader';
import { YouTubeShortsDownloader } from './components/tools/YouTubeShortsDownloader';
import { FacebookVideoDownloader } from './components/tools/FacebookVideoDownloader';
import { TwitterVideoDownloader } from './components/tools/TwitterVideoDownloader';
import { LinkedInVideoDownloader } from './components/tools/LinkedInVideoDownloader';
import { VimeoVideoDownloader } from './components/tools/VimeoVideoDownloader';


// A map of tool IDs to their respective components
const toolComponentMap: { [key: string]: React.FC<any> } = {
  'ai-image-editor': AiImageEditor,
  'case-converter-pro': CaseConverter,
  'color-palette-extractor': ColorPaletteExtractor,
  'ai-startup-name-mixer': StartupNameMixer,
  'online-voice-recorder': VoiceRecorder,
  'ai-crush-predictor': AiCrushPredictor,
  'ai-future-job-finder': AiFutureJobFinder,
  'ai-mood-detector': AiMoodDetector,
  'ai-bio-caption-maker': AiBioCaptionMaker,
  'ai-pet-name-generator': AiPetNameGenerator,
  'ai-friend-compatibility': AiFriendCompatibility,
  'ai-article-writer': AiArticleWriter,
  'ai-presentation-maker': AiPresentationMaker,
  'ai-idea-generator': AiIdeaGenerator,
  'ai-resume-generator': AiResumeGenerator,
  'ai-thumbnail-banner-generator': AiThumbnailBannerGenerator,
  'typing-speed-test': TypingSpeedTest,
  'quiz-creator': QuizCreator,
  'notes-organizer': NotesOrganizer,
  'vocabulary-trainer': VocabularyTrainer,
  'essay-outline-generator': EssayOutlineGenerator,
  'text-highlighter': TextHighlighter,
  'mind-map-generator': MindMapMaker,
  'flashcard-maker': FlashcardMaker,
  'flashcard-generator': FlashcardMaker, // Both IDs now point to the new functional component
  'brand-name-finder': BrandNameFinder,
  'slogan-creator': SloganCreator,
  'scientific-calculator': ScientificCalculator,
  'equation-solver': EquationSolver,
  'periodic-table-explorer': PeriodicTableExplorer,
  'geometry-diagram-maker': GeometryDiagramMaker,
  'math-worksheet-generator': MathWorksheetGenerator,
  'chemistry-equation-balancer': ChemistryEquationBalancer,
  'physics-formula-finder': PhysicsFormulaFinder,
  'motivation-quote-widget': MotivationQuoteWidget,
  'concept-map-generator': ConceptMapGenerator,
  'daily-challenge-generator': DailyChallengeGenerator,
  'crossword-maker': CrosswordMaker,
  'lesson-plan-maker': LessonPlanMaker,
  'student-feedback-form-builder': StudentFeedbackFormBuilder,
  'insta-hashtag-finder': InstaHashtagFinder,
  'ai-age-predictor': AiAgePredictor,
  'face-symmetry-checker': FaceSymmetryChecker,
  'cartoon-face-generator': CartoonFaceGenerator,
  'old-age-filter': OldAgeFilter,
  'baby-face-predictor': BabyFacePredictor,
  'future-face-generator': FutureFaceGenerator,
  'celebrity-look-alike-finder': CelebrityLookAlikeFinder,
  'quote-maker': QuoteMaker,
  'youtube-thumbnail-caption-maker': YouTubeThumbnailCaptionMaker,
  'reel-hook-line-creator': ReelHookLineCreator,
  'trend-tracker': TrendTracker,
  'bio-emoji-styler': BioEmojiStyler,
  'youtube-video-idea-generator': YouTubeVideoIdeaGenerator,
  'story-plot-generator': StoryPlotGenerator,
  'poem-creator': PoemCreator,
  'song-lyrics-maker': SongLyricsMaker,
  'product-description-writer': ProductDescriptionWriter,
  'article-summarizer': ArticleSummarizer,
  'paragraph-rewriter': ParagraphRewriter,
  'essay-expander': EssayExpander,
  'book-title-generator': BookTitleGenerator,
  'newsletter-name-generator': NewsletterNameGenerator,
  'joke-generator': JokeGenerator,
  'tweet-idea-maker': TweetIdeaMaker,
  'comment-generator': CommentGenerator,
  'keyword-idea-generator': KeywordIdeaGenerator,
  'headline-analyzer': HeadlineAnalyzer,
  'ad-copy-generator': AdCopyGenerator,
  'blog-intro-maker': BlogIntroMaker,
  'blog-outro-maker': BlogOutroMaker,
  'short-story-generator': ShortStoryGenerator,
  'recipe-writer': RecipeWriter,
  'test-paper-generator': TestPaperGenerator,
  'student-report-card-generator': StudentReportCardGenerator,
  'credit-score-improvement-planner': CreditScoreImprovementPlanner,
  'credit-card-checker': CreditCardChecker,
  'investment-risk-analyzer': InvestmentRiskAnalyzer,
  'loan-eligibility-calculator': LoanEligibilityCalculator,
  'loan-emi-planner': LoanEmiPlanner,
  'business-loan-comparison': BusinessLoanComparison,
  'personal-loan-calculator': PersonalLoanCalculator,
  'home-loan-affordability-tool': HomeLoanAffordabilityTool,
  'debt-to-income-ratio-calculator': DebtToIncomeRatioCalculator,
  'sip-calculator': SipCalculator,
  'mutual-fund-return-estimator': MutualFundReturnEstimator,
  'stock-tax-calculator': StockTaxCalculator,
  'capital-gains-tax-calculator': CapitalGainsTaxCalculator,
  'intraday-breakeven-calculator': IntradayBreakevenCalculator,
  'gst-calculator': GstCalculator,
  'gst-reverse-charge-tool': GstReverseChargeTool,
  'insurance-coverage-suggestor': InsuranceCoverageSuggestor,
  'term-insurance-need-estimator': TermInsuranceNeedEstimator,
  'health-insurance-planner': HealthInsurancePlanner,
  'travel-insurance-coverage-checker': TravelInsuranceCoverageChecker,
  'child-education-cost-calculator': ChildEducationCostCalculator,
  'wealth-accumulation-planner': WealthAccumulationPlanner,
  'inflation-impact-calculator': InflationImpactCalculator,
  'savings-growth-calculator': SavingsGrowthCalculator,
  'fixed-deposit-calculator': FixedDepositCalculator,
  'recurring-deposit-calculator': RecurringDepositCalculator,
  'compound-interest-visualizer': CompoundInterestVisualizer,
  'income-tax-bracket-checker': IncomeTaxBracketChecker,
  'section-80c-tax-savings-planner': Section80cTaxSavingsPlanner,
  'tds-calculator': TdsCalculator,
  'salary-breakdown-tool': SalaryBreakdownTool,
  'nri-tax-calculator': NriTaxCalculator,
  'international-salary-converter': InternationalSalaryConverter,
  'property-loan-eligibility-tool': PropertyLoanEligibilityTool,
  'rent-vs-buy-calculator': RentVsBuyCalculator,
  'home-loan-balance-transfer-benefit-tool': HomeLoanBalanceTransferBenefitTool,
  'import-custom-duty-calculator': ImportCustomDutyCalculator,
  'import-cost-estimator': ImportCostEstimator,
  'gold-investment-return-calculator': GoldInvestmentReturnCalculator,
  'ppf-calculator': PpfCalculator,
  'nps-calculator': NpsCalculator,
  'car-loan-emi-tool': CarLoanEmiTool,
  'bike-loan-calculator': BikeLoanCalculator,
  'luxury-tax-calculator': LuxuryTaxCalculator,
  'personal-budget-planner': PersonalBudgetPlanner,
  'annual-expense-breakdown-tool': AnnualExpenseBreakdownTool,
  'merge-split-compress-pdf': MergeSplitCompressPdf,
  'word-to-pdf': WordToPdf,
  'pdf-to-word': PdfToWord,
  'image-to-pdf': ImageToPdf,
  'esign-pdf': EsignPdf,
  'ocr': Ocr,
  'pdf-to-ppt': PdfToPpt,
  'ppt-to-pdf': PptToPdf,
  'pdf-merge': PdfMergeTool,
  'pdf-split': PdfSplitTool,
  'pdf-compressor': PdfCompressor,
  'pdf-unlocker': PdfUnlocker,
  'pdf-locker': PdfLocker,
  'pdf-page-remover': PdfPageRemover,
  'pdf-page-rotator': PdfPageRotator,
  'pdf-to-excel': PdfToExcelConverter,
  'text-to-pdf': TextToPdfConverter,
  'pdf-page-extractor': PdfPageExtractor,
  'pdf-page-rearranger': PdfPageRearranger,
  'pdf-crop-tool': PdfCropTool,
  'pdf-page-size-changer': PdfPageSizeChanger,
  'pdf-password-generator': PdfPasswordGenerator,
  'pdf-header-footer-adder': PdfHeaderFooterAdder,
  'pdf-background-remover': PdfBackgroundRemover,
  'pdf-to-html': PdfToHtmlConverter,
  'html-to-pdf': HtmlToPdfConverter,
  'pdf-to-csv': PdfToCsvConverter,
  'csv-to-pdf': CsvToPdfConverter,
  'csv-to-json-converter': CsvToJsonConverter,
  'pdf-file-merger-drag-drop': PdfFileMergerDragDrop,
  'batch-pdf-converter': BatchPdfToImageConverter,
  'convert-multiple-docs-to-pdf': BatchDocToPdfConverter,
  'pdf-compare-tool': PdfCompareTool,
  'document-translator': DocumentTranslator,
  'resume-to-pdf-formatter': ResumeToPdfFormatter,
  'invoice-to-pdf-generator': InvoiceToPdfGenerator,
  'pdf-certificate-maker': PdfCertificateMaker,
  'page-to-image-snapshot': PageToImageSnapshotTool,
  'document-to-zip': DocumentToZipConverter,
  'readable-pdf-text-viewer': ReadablePdfTextViewer,
  'extract-tables-from-pdf': ExtractTablesFromPdf,
  'pdf-watermark-remover': PdfWatermarkRemover,
  'pdf-highlight-remover': PdfHighlightRemover,
  'pdf-redact-tool': PdfRedactTool,
  'pdf-annotation-editor': PdfAnnotationEditor,
  'pdf-bookmark-manager': PdfBookmarkManager,
  'pdf-comment-extractor': PdfCommentExtractor,
  'pdf-signature-validator': PdfSignatureValidator,
  'scanned-pdf-to-searchable': ScannedPdfToSearchablePdf,
  'pdf-file-renamer': PdfFileRenamer,
  'pdf-merge-by-folder': PdfMergeByFolder,
  'page-number-remover': PageNumberRemover,
  'resume-to-pdf-designer': ResumeToPdfDesigner,
  'cover-letter-formatter': CoverLetterFormatter,
  'legal-document-formatter': LegalDocumentFormatter,
  'contract-template-generator': ContractTemplateGenerator,
  'page-by-page-pdf-viewer': PageByPagePdfViewer,
  'pdf-to-zip-compressor': PdfToZipCompressor,
  'pdf-encrypt-decrypt': PdfEncryptDecryptTool,
  'pdf-rotate-by-degree': PdfRotateByDegree,
  'dark-humor-generator': DarkHumorGenerator,
  'dad-joke-creator': DadJokeCreator,
  'funny-quote-generator': FunnyQuoteGenerator,
  'roast-me-generator': RoastMeGenerator,
  'meme-caption-generator': MemeCaptionGenerator,
  'twitter-post-meme-maker': TwitterPostMemeMaker,
  'instagram-post-caption-generator': InstagramPostCaptionGenerator,
  'fake-chat-maker': FakeChatMaker,
  'fake-news-headline-creator': FakeNewsHeadlineCreator,
  'random-rumor-generator': RandomRumorGenerator,
  'screenshot-prank-creator': ScreenshotPrankCreator,
  'random-story-starter': RandomStoryStarter,
  'what-if-scenario-generator': WhatIfScenarioGenerator,
  'iq-calculator': IQCalculator,
  'attractiveness-meter': AttractivenessMeter,
  'how-old-do-you-look-meter': HowOldDoYouLookMeter,
  'gender-guesser': GenderGuesser,
  'tattoo-design-idea-generator': TattooDesignIdeaGenerator,
  'username-creator': UsernameCreator,
  'signature-style-creator': SignatureStyleCreator,
  'wallpaper-maker': WallpaperMaker,
  'logo-generator': LogoGenerator,
  'fake-identity-generator': FakeIdentityGenerator,
  'pixel-art-maker': PixelArtMaker,
  'cartoonify-tool': CartoonifyTool,
  'background-remover': BackgroundRemover,
  'image-compressor': ImageCompressor,
  'convert-image': ConvertImage,
  'image-brightness-editor': ImageBrightnessEditor,
  'image-contrast-editor': ImageContrastEditor,
  'image-sharpen-tool': ImageSharpenTool,
  'red-eye-remover': RedEyeRemover,
  'object-eraser': ObjectEraser,
  'profile-picture-maker': ProfilePictureMaker,
  'movie-dialogue-generator': MovieDialogueGenerator,
  'compliment-maker': ComplimentMaker,
  'dream-meaning-interpreter': DreamMeaningInterpreter,
  'life-advice-generator': LifeAdviceGenerator,
  'lucky-number-generator': LuckyNumberGenerator,
  'zodiac-compatibility-finder': ZodiacCompatibilityFinder,
  'horoscope-generator': HoroscopeGenerator,
  'daily-affirmation-generator': DailyAffirmationGenerator,
  'life-goal-planner': LifeGoalPlanner,
  'personality-test-mbti-style': PersonalityTest,
  'innovation-score-calculator': InnovationScoreCalculator,
  'risk-analyzer': RiskAnalyzer,
  'brainstorm-board-tool': BrainstormBoardTool,
  'document-reading-time': DocumentReadingTimeCalculator,
  'sales-pitch-generator': SalesPitchGenerator,
  'love-letter-writer': LoveLetterWriter,
  'ip-address-finder': IpAddressFinder,
  'business-valuation-calculator': BusinessValuationCalculator,
  'burn-rate-calculator': BurnRateCalculator,
  'runway-calculator': RunwayCalculator,
  'profit-margin-calculator': ProfitMarginCalculator,
  'product-pricing-calculator': ProductPricingCalculator,
  'break-even-point-calculator': BreakEvenPointCalculator,
  'wholesale-vs-retail-profit-tool': WholesaleVsRetailProfitTool,
  'employee-salary-cost-tool': EmployeeSalaryCostTool,
  'business-plan-generator': BusinessPlanGenerator,
  'investor-pitch-generator': InvestorPitchGenerator,
  'brand-slogan-generator': BrandSloganGenerator,

  // Newly implemented tools
  'youtube-thumbnail-creator': YouTubeThumbnailCreator,
  'instagram-story-crop-tool': InstagramStoryCropTool,
  'linkedin-banner-maker': LinkedInBannerMaker,
  'twitter-header-cropper': TwitterHeaderCropper,
  'discord-pfp-maker': DiscordPfpMaker,
  'glitch-effect-creator': GlitchEffectCreator,
  'noise-adder-remover': NoiseAdderRemover,
  'lens-distortion-tool': LensDistortionTool,
  'halftone-effect-maker': HalftoneEffectMaker,
  'image-difference-finder': ImageDifferenceFinder,
  'gif-splitter': GifSplitter,
  'image-histogram-viewer': ImageHistogramViewer,
  'duplicate-image-finder': DuplicateImageFinder,
  'batch-image-exporter': BatchImageExporter,
  'notes-to-pdf': NotesToPdf,
  'letterhead-template-creator': LetterheadTemplateCreator,
  'invoice-pdf-auto-filler': InvoicePdfAutoFiller,
  'smart-merge': SmartMerge,
  'page-orientation-changer': PageOrientationChanger,
  'pdf-to-zip-auto-organizer': PdfToZipAutoOrganizer,
  'pdf-to-txt-batch': PdfToTxtBatchConverter,
  'pdf-split-by-bookmarks': PdfSplitByBookmarks,
  'logo-overlay-tool': LogoOverlayTool,

  // Placeholder tools
  'pdf-thumbnail-preview-generator': PdfThumbnailPreviewGenerator,
  'pdf-to-epub': PdfToEpubConverter,
  'epub-to-pdf': EpubToPdfConverter,
  'word-to-html': WordToHtmlConverter,
  'html-to-word': HtmlToWordConverter,
  'powerpoint-slide-merger': PowerpointSlideMerger,
  'docx-metadata-remover': DocxMetadataRemover,
  'pdf-size-reducer-lossless': PdfSizeReducerLossless,
  'pdf-text-replacer': PdfTextReplacer,
  'pdf-font-identifier': PdfFontIdentifier,
  'pdf-border-adder': PdfBorderAdder,
  'pdf-shadow-effect': PdfShadowEffectTool,
  'pdf-to-black-and-white': PdfToBlackAndWhiteConverter,
  'pdf-page-color-adjuster': PdfPageColorAdjuster,
  'pdf-transparency-editor': PdfTransparencyEditor,
  'pdf-dpi-enhancer': PdfDpiEnhancer,
  'page-margin-adjuster': PageMarginAdjuster,
  'resume-to-docx': ResumeToDocxConverter,
  'text-formatter-for-pdf': TextFormatterForPdf,
  'document-word-counter': DocumentWordCounter,
  'pdf-to-markdown': PdfToMarkdownConverter,
  'markdown-to-pdf': MarkdownToPdfConverter,
  'text-extractor-from-docx': TextExtractorFromDocx,

  // New Face & Style Tool Placeholders
  'ai-face-swap-tool': AiFaceSwapTool,
  'ai-gender-swap-photo-maker': AiGenderSwapPhotoMaker,
  'ai-age-progression': AiAgeProgression,
  'ai-age-regression': AiAgeRegression,
  'ai-hairstyle-try-on': AiHairstyleTryOnTool,
  'ai-beard-try-on': AiBeardTryOnTool,
  'ai-makeup-generator': AiMakeupGenerator,
  'ai-face-expression-changer': AiFaceExpressionChanger,
  'ai-photo-to-anime-cartoon': AiPhotoToAnimeCartoon,
  'ai-hollywood-look-filter': AiHollywoodLookFilter,

  // Newly added Business Tools
  'business-name-generator': BusinessNameGenerator,
  'invoice-maker': InvoiceMaker,
  'expense-tracker-tool': ExpenseTrackerTool,
  'inventory-calculator': InventoryCalculator,
  'vendor-comparison-tool': VendorComparisonTool,
  'market-research-generator': MarketResearchGenerator,
  'swot-analyzer': SWOTAnalyzer,
  'competitor-analysis-tool': CompetitorAnalysisTool,
  'business-risk-score-tool': BusinessRiskScoreTool,
  'franchise-cost-estimator': FranchiseCostEstimator,
  'digital-marketing-budget-planner': DigitalMarketingBudgetPlanner,
  'ad-roi-calculator': AdRoiCalculator,
  'ltv-calculator': LtvCalculator,
  'cac-calculator': CacCalculator,
  'recruitment-cost-calculator': RecruitmentCostCalculator,
  'startup-growth-planner': StartupGrowthPlanner,
  'business-model-builder': BusinessModelBuilder,
  'productivity-score-calculator': ProductivityScoreCalculator,
  'resource-allocation-tool': ResourceAllocationTool,
  'email-response-suggestor': EmailResponseSuggestor,
  'sales-funnel-builder': SalesFunnelBuilder,
  'client-proposal-writer': ClientProposalWriter,
  'product-launch-planner': ProductLaunchPlanner,
  'team-performance-analyzer': TeamPerformanceAnalyzer,
  'customer-satisfaction-score-tool': CustomerSatisfactionScoreTool,
  'feedback-analysis-tool': FeedbackAnalysisTool,
  'salary-negotiation-calculator': SalaryNegotiationCalculator,
  'marketing-calendar-generator': MarketingCalendarGenerator,
  'agreement-contract-generator': AgreementContractGenerator,
  'vendor-payment-schedule-tool': VendorPaymentScheduleTool,
  'customer-segmentation-tool': CustomerSegmentationTool,
  'price-testing-calculator': PriceTestingCalculator,
  'retail-profit-estimator': RetailProfitEstimator,
  'shipping-cost-calculator': ShippingCostCalculator,
  'productivity-time-blocker': ProductivityTimeBlocker,
  'subscription-profit-calculator': SubscriptionProfitCalculator,
  'saas-pricing-calculator': SaaSPricingCalculator,
  'business-growth-projection-tool': BusinessGrowthProjectionTool,
  'google-ads-budget-estimator': GoogleAdsBudgetEstimator,
  'facebook-ads-budget-tool': FacebookAdsBudgetTool,
  'marketing-funnel-generator': MarketingFunnelGenerator,
  'seo-keyword-cluster-tool': SeoKeywordClusterTool,
  'backlink-analyzer-manual': BacklinkAnalyzer,
  'serp-checker': SerpChecker,
  'meta-description-generator': MetaDescriptionGenerator,
  'marketing-blog-title-generator': MarketingBlogTitleGenerator,
  'ppc-roi-calculator': PpcRoiCalculator,
  'landing-page-analyzer': LandingPageAnalyzer,
  'email-sequence-generator': EmailSequenceGenerator,
  'cold-email-writer': ColdEmailWriter,
  'lead-magnet-generator': LeadMagnetGenerator,
  'content-calendar-generator': ContentCalendarGenerator,
  'conversion-rate-calculator': ConversionRateCalculator,
  'ab-testing-planner': AbTestingPlanner,
  'brand-style-guide-generator': BrandStyleGuideGenerator,
  'social-media-post-planner': SocialMediaPostPlanner,
  'viewer-retention-calculator': ViewerRetentionCalculator,
  'video-watch-time-calculator': VideoWatchTimeCalculator,
  'youtube-title-tags-generator': YouTubeTitleTagsGenerator,
  'hashtag-rank-analyzer': HashtagRankAnalyzer,
  'website-heatmap-simulator': WebsiteHeatmapSimulator,

  // New Marketing/SaaS Tools from user
  'refund-rate-calculator': RefundRateCalculator,
  'customer-support-script-writer': CustomerSupportScriptWriter,
  'ai-ad-creative-planner': AiAdCreativePlanner,
  'brand-competition-analyzer': BrandCompetitionAnalyzer,
  'marketing-kpi-dashboard': MarketingKpiDashboard,
  'webinar-funnel-planner': WebinarFunnelPlanner,

  // Newly implemented Language & Communication Tools
  'rhyming-word-generator': RhymingWordGenerator,
  'sentence-rephraser': SentenceRephraser,
  'english-pronunciation-helper': EnglishPronunciationHelper,
  'text-to-ipa-converter': TextToIpaConverter,
  'speech-to-text': SpeechToTextTool,
  'text-to-speech-native': TextToSpeechTool,
  'email-template-generator': EmailTemplateGenerator,
  'resume-grammar-checker': ResumeGrammarChecker,
  
  // Newly implemented Media Tools
  'video-compressor': VideoCompressor,
  'screen-recorder': ScreenRecorder,
  'audio-cutter-joiner': AudioCutterJoiner,
  'subtitle-generator': SubtitleGenerator,
  'instagram-reels-downloader': InstagramReelsDownloader,
  'tiktok-downloader': TikTokDownloader,
  'youtube-to-mp4': YouTubeToMp4Converter,
  'audio-watermark-detector': AudioWatermarkDetector,
  'audio-to-midi-converter': AudioToMidiConverter,
  'video-to-mp3-cutter-direct': VideoToMp3Cutter,
  'convert-youtube-live-stream-to-audio': YouTubeLiveStreamToAudio,
  'audio-spectrum-visualizer': AudioSpectrumVisualizer,
  'background-remover-video': VideoBackgroundRemover,
  'voice-to-music-converter': VoiceToMusicConverter,
  'auto-video-subtitle-remover': VideoSubtitleRemover,
  'video-format-detector': VideoFormatDetector,
  'video-metadata-editor': VideoMetadataEditor,
  'dailymotion-downloader': DailyMotionDownloader,
  'reddit-video-downloader': RedditVideoDownloader,
  'pinterest-video-downloader': PinterestVideoDownloader,
  'twitch-clip-downloader': TwitchClipDownloader,
  'mixcloud-downloader': MixCloudDownloader,
  'soundcloud-downloader': SoundCloudDownloader,
  'spotify-playlist-converter': SpotifyPlaylistConverter,
  'radio-stream-recorder': RadioStreamRecorder,

  // New Media Tools
  'screen-capture': ScreenCapture,
  'live-stream-recorder': LiveStreamRecorder,
  'youtube-comments-downloader': YouTubeCommentsDownloader,
  'youtube-shorts-downloader': YouTubeShortsDownloader,
  'facebook-video-downloader': FacebookVideoDownloader,
  'twitter-x-video-downloader': TwitterVideoDownloader,
  'linkedin-video-downloader': LinkedInVideoDownloader,
  'vimeo-video-downloader': VimeoVideoDownloader,
};

type AppState = 'home' | 'category' | 'tool' | 'page';

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<{ id: string, name: string } | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  
  const appState: AppState = useMemo(() => {
    if (activePage) return 'page';
    if (activeTool) return 'tool';
    if (activeCategory) return 'category';
    return 'home';
  }, [activeCategory, activeTool, activePage]);

  const handleSelectCategory = useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
    setActiveTool(null);
    setActivePage(null);
  }, []);

  const handleSelectTool = useCallback((toolId: string, toolName: string) => {
    const category = toolData.find(cat => cat.tools.some(tool => tool.id === toolId));
    setActiveCategory(category?.name || null);
    setActiveTool({ id: toolId, name: toolName });
    setActivePage(null);
  }, []);
  
  const handleSelectPage = useCallback((page: string) => {
    setActiveCategory(null);
    setActiveTool(null);
    setActivePage(page);
  }, []);

  const goHome = useCallback(() => {
    setActiveCategory(null);
    setActiveTool(null);
    setActivePage(null);
  }, []);
  
  const goBackToCategory = useCallback(() => {
    setActiveTool(null);
    setActivePage(null);
  }, []);

  const renderContent = () => {
    switch(appState) {
      case 'tool':
        if (activeTool && toolComponentMap[activeTool.id]) {
          const ComponentToRender = toolComponentMap[activeTool.id];
          // All components in the map will receive the `title` prop
          return <ComponentToRender title={activeTool.name} />;
        }
        return <ToolPlaceholder title={activeTool?.name || 'Tool'} />;
      
      case 'category':
        const categoryData = toolData.find(cat => cat.name === activeCategory);
        if (categoryData) {
          return <CategoryPage category={categoryData} onSelectTool={handleSelectTool} />;
        }
        return <HomePage onSelectCategory={handleSelectCategory} onSelectTool={handleSelectTool} />;
      
      case 'page':
        switch(activePage) {
          case 'privacy': return <PrivacyPolicy />;
          case 'terms': return <TermsAndConditions />;
          case 'about': return <AboutUs />;
          case 'contact': return <ContactUs />;
          default: return <HomePage onSelectCategory={handleSelectCategory} onSelectTool={handleSelectTool} />;
        }

      case 'home':
      default:
        return <HomePage onSelectCategory={handleSelectCategory} onSelectTool={handleSelectTool} />;
    }
  };
  
  const breadcrumbs = useMemo(() => {
    // FIX: Explicitly type the array to allow objects with and without the optional 'onClick' property.
    const crumbs: { label: string; onClick?: () => void }[] = [{ label: 'Home', onClick: goHome }];
    if (activeCategory) {
      crumbs.push({ label: activeCategory, onClick: appState === 'tool' ? goBackToCategory : undefined });
    }
    if (appState === 'tool' && activeTool) {
      // FIX: This now matches the explicit type of the 'crumbs' array.
      crumbs.push({ label: activeTool.name });
    }
    if (appState === 'page' && activePage) {
       const pageTitle = activePage.charAt(0).toUpperCase() + activePage.slice(1);
       // FIX: This now matches the explicit type of the 'crumbs' array.
       crumbs.push({ label: pageTitle });
    }
    return crumbs;
  }, [appState, activeCategory, activeTool, activePage, goHome, goBackToCategory]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col">
      <Header 
        onGoHome={goHome} 
        showHomeButton={appState !== 'home'}
        onSelectTool={handleSelectTool}
        onSelectCategory={handleSelectCategory}
      />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
        {appState !== 'home' && <Breadcrumb crumbs={breadcrumbs} />}
        {renderContent()}
      </main>
      <Footer onSelectPage={handleSelectPage} />
    </div>
  );
}

export default App;