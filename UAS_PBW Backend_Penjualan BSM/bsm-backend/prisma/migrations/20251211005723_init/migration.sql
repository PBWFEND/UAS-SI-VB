-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('KONSUMEN', 'ADMIN', 'KARYAWAN', 'OWNER') NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `no_hp` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `id_produk` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_produk` VARCHAR(191) NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `stok` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,
    `img` VARCHAR(191) NULL,

    PRIMARY KEY (`id_produk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tmc` (
    `id_tmc` INTEGER NOT NULL AUTO_INCREMENT,
    `id_konsumen` INTEGER NOT NULL,
    `id_karyawan` INTEGER NULL,
    `id_admin` INTEGER NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `biaya_ongkir` INTEGER NOT NULL,
    `metode_pengiriman` VARCHAR(191) NOT NULL,
    `status_pembayaran` VARCHAR(191) NOT NULL,
    `status_pengiriman` VARCHAR(191) NOT NULL,
    `nomor_invoice` VARCHAR(191) NOT NULL,
    `nomor_resi` VARCHAR(191) NULL,
    `status_arsip` VARCHAR(191) NOT NULL,
    `bukti_pembayaran` VARCHAR(191) NULL,

    UNIQUE INDEX `Tmc_nomor_invoice_key`(`nomor_invoice`),
    PRIMARY KEY (`id_tmc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tdc` (
    `id_tdc` INTEGER NOT NULL AUTO_INCREMENT,
    `id_konsumen` INTEGER NOT NULL,
    `id_karyawan` INTEGER NULL,
    `id_admin` INTEGER NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `biaya_ongkir` INTEGER NOT NULL,
    `metode_pengiriman` VARCHAR(191) NOT NULL,
    `status_pembayaran` VARCHAR(191) NOT NULL,
    `status_pengiriman` VARCHAR(191) NOT NULL,
    `nomor_invoice` VARCHAR(191) NOT NULL,
    `nomor_resi` VARCHAR(191) NULL,
    `status_arsip` VARCHAR(191) NOT NULL,
    `bukti_pembayaran` VARCHAR(191) NULL,

    UNIQUE INDEX `Tdc_nomor_invoice_key`(`nomor_invoice`),
    PRIMARY KEY (`id_tdc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailPenjualan` (
    `id_detail` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tmc` INTEGER NOT NULL,
    `id_produk` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `harga_satuan` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,

    PRIMARY KEY (`id_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tmc` ADD CONSTRAINT `Tmc_id_konsumen_fkey` FOREIGN KEY (`id_konsumen`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tdc` ADD CONSTRAINT `Tdc_id_konsumen_fkey` FOREIGN KEY (`id_konsumen`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPenjualan` ADD CONSTRAINT `DetailPenjualan_id_tmc_fkey` FOREIGN KEY (`id_tmc`) REFERENCES `Tmc`(`id_tmc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPenjualan` ADD CONSTRAINT `DetailPenjualan_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `Produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;
