"""
Logging configuration for the Binance Futures trading bot.
Sets up both file-based and console logging with structured formatting.
"""

import logging
import os
from datetime import datetime


LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, f"trading_bot_{datetime.now().strftime('%Y%m%d')}.log")


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """
    Configure and return the root logger for the trading bot.

    Creates a 'logs/' directory if it doesn't exist, attaches a rotating
    file handler (daily log file) and a console handler with clean output.

    Args:
        log_level: Logging level as a string (DEBUG, INFO, WARNING, ERROR).

    Returns:
        Configured Logger instance named 'trading_bot'.
    """
    os.makedirs(LOG_DIR, exist_ok=True)

    logger = logging.getLogger("trading_bot")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    # Avoid adding duplicate handlers on repeated calls
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # File handler — captures everything at DEBUG and above
    file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    # Console handler — shows INFO and above so output stays readable
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(
        logging.Formatter(fmt="%(levelname)-8s | %(message)s")
    )

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    logger.info("Logging initialised — writing to %s", LOG_FILE)
    return logger
